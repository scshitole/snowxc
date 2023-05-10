var f5xc_api = new x_830134_big_ip_0.f5xc_api();

var post_http_loadbalancer = f5xc_api.post_http_loadbalancer(current.variables.tenant_name.toString(), current.variables.namespaces.getDisplayValue(), workflow.scratchpad.http_load_balancer_string);

current.work_notes = post_http_loadbalancer;