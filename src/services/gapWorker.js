const { pool } = require('./database');
const ProcessModel = require('../mvc/v1/model/process.model');
const ProcessLogModel = require('../mvc/v1/model/processLog.model');
const { getBoss } = require('./pgBoss');

const GAP_CALCULATION_QUEUE = 'gap-calculation';

const startGapWorker = async () => {
    const boss = await getBoss();

    await boss.createQueue(GAP_CALCULATION_QUEUE);

    await boss.work(GAP_CALCULATION_QUEUE, async (jobs) => {
        for (const job of jobs) {
            console.log(`[gapWorker] Job completo:`, JSON.stringify(job));
            if (!job.data) {
                console.warn(`[gapWorker] Job ${job.id} sin datos, descartando`);
                continue;
            }
            const { procId, procCode, procPurcCode, procStock, procDemand, procStandard } = job.data;
            const client = await pool.connect();
            try {
                await client.
                query('BEGIN');
                await client.query(
                    'CALL p01_run_brecha_bib($1::bigint, $2::varchar, $3::varchar, $4::bigint, $5::bigint, $6::bigint)',
                    [procId, procCode, procPurcCode, procStock, procDemand, procStandard]
                );
                await client.query('COMMIT');

                await ProcessModel.updateProcess({ proc_status: 'C' }, procId);
                await ProcessLogModel.createProcessLog({
                    proclProcId: procId,
                    proclLog: `Gap Calculation Success: ${procCode} at: ${new Date()} with procStock: ${procStock}, procDemand: ${procDemand}, procStandard: ${procStandard}`,
                });
            } catch (error) {
                await client.query('ROLLBACK');
                await ProcessModel.updateProcess({ proc_status: 'E' }, procId);
                await ProcessLogModel.createProcessLog({
                    proclProcId: procId,
                    proclLog: `Gap Calculation ${procCode} error at: ${new Date()}: ${error.message}`,
                });
                throw error;
            } finally {
                client.release();
            }
        }
    });

    console.log('Gap calculation worker iniciado');
};

module.exports = { startGapWorker, GAP_CALCULATION_QUEUE };
