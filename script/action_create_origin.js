var f5xc_api = new x_830134_big_ip_0.f5xc_api();

var post_origin_pool = f5xc_api.post_origin_pool(current.variables.tenant_name.toString(), current.variables.namespaces.getDisplayValue(), workflow.scratchpad.origin_pool_string);

current.work_notes = post_origin_pool;