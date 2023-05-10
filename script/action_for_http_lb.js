// Instantiate the request object and populate variables
var http_load_balancer = {
    "metadata": {
        "name": current.variables.http_load_balancer_name.toString(),
        "namespace": current.variables.namespaces.getDisplayValue(),
        "labels": {},
        "annotations": {},
        "description": current.variables.http_load_balancer_description.toString(),
        "disable": null
    },
    "spec": {
        "domains": create_domains(current.variables.domain_list),
        "http": {
            "dns_volterra_managed": true,
            "port": parseInt(current.variables.http_port.toString()),
        },
        //"advertise_on_public_default_vip": {},
        "routes": [],
        "disable_waf": {},
        "add_location": false,
        "no_challenge": {},
        "user_id_client_ip": {},
        "disable_rate_limit": {},
        "waf_exclusion_rules": [],
        "data_guard_rules": [],
        "blocked_clients": [],
        "trusted_clients": [],
        "service_policies_from_namespace": {},
        "multi_lb_app": {},
        "disable_bot_defense": {},
        "disable_api_definition": {},
        "disable_ip_reputation": {}
    }
};

// Set Pools
http_load_balancer.spec.default_route_pools = create_route_pools(current.variables.origin_pools);

// Set Load Balancer Type
http_load_balancer.spec[current.variables.http_load_balancer_advertisement] = {};

// Set Load Balancer Algorithm
http_load_balancer.spec[current.variables.load_balancing_algorithm] = {};

// Set the pool object in both JSON and string forms
workflow.scratchpad.http_load_balancer = http_load_balancer;
workflow.scratchpad.http_load_balancer_string = JSON.stringify(http_load_balancer);

current.work_notes = workflow.scratchpad.http_load_balancer_string;


// Create the domains array from the domain list object
function create_domains(domain_list) {
	var domains = [];
	
	domain_list = JSON.parse(domain_list);
	var domain_list_count = domain_list.length;
	
	for (var domain_index = 0; domain_index < domain_list_count; domain_index++) {
		var domain = domain_list[domain_index].domain_list_dns_name;
		
		domains.push(domain);
	}
	
	return domains;
}

// Create the origin pool objects and add to
// the route pool
function create_route_pools(origin_pools) {
	var route_pools = [];
	var namespace = current.variables.namespaces.getDisplayValue();
	
	origin_pools = JSON.parse(origin_pools);
	var origin_pool_count = origin_pools.length;
	
	for(var op_index = 0; op_index < origin_pool_count; op_index++){
		var origin_pool = origin_pools[op_index];
		var origin_pool_name = origin_pool.origin_pools_origin_pool;
		var origin_pool_weight = origin_pool.origin_pools_weight;
		var origin_pool_priority = origin_pool.origin_pools_priority;

		route_pools.push(create_origin_pool(namespace, origin_pool_name, origin_pool_weight, origin_pool_priority));
	}

	return route_pools;
	
}

function create_origin_pool(namespace, name, weight, priority) {
	var origin_pool = {
		"pool": {
			"tenant": "f5-sa-rnxeudss",
			"namespace": namespace,
			"name": name
		},
		"weight": weight,
		"priority": priority,
		"endpoint_subsets": {}
	};
	
	return origin_pool;
	
}
