import { i as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BX8rcxZz.mjs";
import { O as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.server-CPApCQRl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeRequirement = createServerFn({ method: "POST" }).handler(createSsrRpc("690fd0e9d3afea85f164bb9929ff0648239845a935cca7c59e08f9ee6a2e524d"));
var generateCommitMessage = createServerFn({ method: "POST" }).handler(createSsrRpc("0a9bb95e9a3c6f06dd8cfd04105da0ff9a0154b47cebbb69bd2b4646bab234a3"));
var generateBranchName = createServerFn({ method: "POST" }).handler(createSsrRpc("d51c2daf7b4bf518762aaf380632b21fb8e4948cc302e39abae807e9392dcdfb"));
var generateTaskBreakdown = createServerFn({ method: "POST" }).handler(createSsrRpc("b5dd1df7e55c851592add2e9f0e0f26c8ccb989adb322b601bbc1233778c3cdd"));
var generateDailyScrumReport = createServerFn({ method: "POST" }).handler(createSsrRpc("65c6ac6af7a3289dda09fd0b2a11a5beeb58530cd8ea073d5c42e5c85128d6b4"));
var generateSprintReport = createServerFn({ method: "POST" }).handler(createSsrRpc("2b42b351c092690234ee33fd73492297062ef80230c3cab949cfd02f86206c3f"));
var qaCheckTask = createServerFn({ method: "POST" }).handler(createSsrRpc("ecb65f557672285b62a233412c736756692cb20204123be61b274453fe63780e"));
var generateProjectInsights = createServerFn({ method: "POST" }).handler(createSsrRpc("d4c13064668bd7a66e0739c0d5d25d4c327cf905ce6c5d1f418e89f4fb639c15"));
//#endregion
export { generateProjectInsights as a, qaCheckTask as c, generateDailyScrumReport as i, useServerFn as l, generateBranchName as n, generateSprintReport as o, generateCommitMessage as r, generateTaskBreakdown as s, analyzeRequirement as t };
