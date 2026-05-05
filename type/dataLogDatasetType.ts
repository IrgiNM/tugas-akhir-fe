export type dataLogDatasetType = {
    id: number;
    ts: string | null;
    uid: string;
    id_orig_h: string;
    id_resp_h: string;
    id_orig_p: number;
    id_resp_p: number;
    duration: number;
    orig_bytes: number;
    resp_bytes: number;
    missed_bytes: number;
    orig_pkts: number;
    orig_ip_bytes: number;
    resp_pkts: number;
    resp_ip_bytes: number;
    proto: string;
    service: string | null | "nan";
    conn_state: string;
    local_orig: string | null | "nan";
    local_resp: string | null | "nan";
    history: string | null;
    tunnel_parents: string | null | "nan";
    label: string;
    detailed_label: string | null | "nan";
    created_at: string;
  }