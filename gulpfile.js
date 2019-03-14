'use strict';

require('fepper/tasker');

/**
 * This file exists for optionally running Fepper tasks with gulp but without
 * fepper-cli.
 *
 * Any documented `fp` task can be run with the `gulp` command. Just replace
 * "fp" with "gulp".
 *
 * Custom code can be added below declaring additional gulp tasks, or anything
 * else for that matter. This file can also be safely deleted. This will not be
 * overwritten by updates. However, fepper-cli will not recognize any tasks in
 * this file. They will not be runnable with the `fp` command.
 */
