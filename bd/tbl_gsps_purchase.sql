create table public.tbl_gaps_purchase
(
    gapp_proc_id              bigint  not null,
    gapp_stock_type           bigint  not null,
    gapp_year                 integer not null,
    gapp_city_code            text    not null,
    gapp_item_code            bigint  not null,
    gapp_initial_gap          double precision,
    gapp_unit_value           integer not null,
    gapp_total_required       double precision,
    gapp_total_purchase_order double precision,
    gapp_total_received       double precision,
    gapp_reconciled_gap       integer,
    gapp_authorized_purchase  integer,
    gapp_status               text,
    gapp_description          text,
    gapp_status_date          timestamp,
    gapp_volumes              text,
    gapp_optimized_gap        double precision,
    gapp_item_status          text,
    gapp_stock_difference     double precision,
    primary key (gapp_proc_id, gapp_stock_type, gapp_year, gapp_city_code, gapp_item_code)
);

alter table public.tbl_gaps_purchase
    owner to neondb_owner;

    alter table public.tbl_gaps_purchase
    add primary key (gapp_proc_id, gapp_stock_type, gapp_year, gapp_city_code, gapp_item_code);


create unique index tbl_gaps_purchase_pkey
    on public.tbl_gaps_purchase (gapp_proc_id, gapp_stock_type, gapp_year, gapp_city_code, gapp_item_code);

