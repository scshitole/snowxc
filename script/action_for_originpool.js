
// Instanstiate the object that will become our request object
var origin_pool = {
    "metadata": {
        "name": current.variables.origin_pool_name.toString(),
        "labels": {},
		"description": current.variables.origin_pool_description.toString()
    },
    "spec": {
        "origin_servers": [],
        "no_tls": {},
        "port": parseInt(current.variables.origin_pool_service_port.toString()),
        "same_as_endpoint_port": {},
        "healthcheck": [],
        "loadbalancer_algorithm": current.variables.load_balancer_algorithm.toString(),
        "endpoint_selection": current.variables.endpoint_selection.toString()
	}
};

// Collect the pool name
origin_pool.metadata.name = current.variables.origin_pool_name.toString();

// Collect the origin server info, create origin server
// request objects, and place them into the origin pool
// request object
var origin_servers = JSON.parse(current.variables.origin_servers);
var origin_server_count = origin_servers.length;

for(var os_index = 0; os_index < origin_server_count; os_index++){
	var origin_server = origin_servers[os_index];
	var origin_server_name_ip_address = origin_server.origin_server_name_ip_address;
	var origin_server_site_virtual_site_name = origin_server.origin_server_site_virtual_site_name;
	var origin_server_site_type = origin_server.origin_server_site_type;
	
	origin_pool.spec.origin_servers.push(create_origin_server(origin_server_name_ip_address, origin_server_site_virtual_site_name, origin_server_site_type));
}

// Set the pool object in both JSON and string forms
workflow.scratchpad.origin_pool = origin_pool;
workflow.scratchpad.origin_pool_string = JSON.stringify(origin_pool);

current.work_notes = workflow.scratchpad.origin_pool;

// Create the origin server object and add to
// the origin pool

function create_origin_server(dns_name, origin_server_site_virtual_site_name, origin_server_site_type) {
	var origin_server = {
        "private_name": {
            "dns_name": dns_name,
            "site_locator": {
                "site": {
                    "tenant": "f5-sa-rnxeudss",
                    "namespace": "system",
                    "name": origin_server_site_virtual_site_name,
                    "kind": origin_server_site_type
                }
            },
            "inside_network": {}
        },
        "labels": {}
    };
	
	return origin_server;
}