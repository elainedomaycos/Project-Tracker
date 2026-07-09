//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BX8rcxZz.js
var manifest = {
	"0a9bb95e9a3c6f06dd8cfd04105da0ff9a0154b47cebbb69bd2b4646bab234a3": {
		functionName: "generateCommitMessage_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"2b42b351c092690234ee33fd73492297062ef80230c3cab949cfd02f86206c3f": {
		functionName: "generateSprintReport_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"65c6ac6af7a3289dda09fd0b2a11a5beeb58530cd8ea073d5c42e5c85128d6b4": {
		functionName: "generateDailyScrumReport_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"690fd0e9d3afea85f164bb9929ff0648239845a935cca7c59e08f9ee6a2e524d": {
		functionName: "analyzeRequirement_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"b5dd1df7e55c851592add2e9f0e0f26c8ccb989adb322b601bbc1233778c3cdd": {
		functionName: "generateTaskBreakdown_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"d4c13064668bd7a66e0739c0d5d25d4c327cf905ce6c5d1f418e89f4fb639c15": {
		functionName: "generateProjectInsights_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"d51c2daf7b4bf518762aaf380632b21fb8e4948cc302e39abae807e9392dcdfb": {
		functionName: "generateBranchName_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	},
	"ecb65f557672285b62a233412c736756692cb20204123be61b274453fe63780e": {
		functionName: "qaCheckTask_createServerFn_handler",
		importer: () => import("./_ssr/ai.server-Nd0-r56y.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
