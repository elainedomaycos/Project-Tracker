import { i as __toESM } from "../_runtime.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as ProjectProvider, r as useProject } from "./project-context-CkM5ik6g.mjs";
import { A as CodeXml, E as ExternalLink, F as ChevronDown, I as ChartColumn, b as FlaskConical, c as Sparkles, g as Key, h as LayoutDashboard, m as ListChecks, t as X } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-zYmXuemJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-XUdI1x5L.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110",
						children: "Back to dashboard"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					})
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Task Tracker — Simple Project & Task Management" },
			{
				name: "description",
				content: "Lightweight task tracking for small teams. No Scrum jargon, just get work done."
			},
			{
				property: "og:title",
				content: "Task Tracker"
			},
			{
				property: "og:description",
				content: "Simple project and task management for small teams."
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var NAV_ITEMS = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"pm",
			"developer",
			"qa",
			"client"
		]
	},
	{
		to: "/tasks",
		label: "Tasks",
		icon: ListChecks,
		roles: [
			"pm",
			"developer",
			"qa"
		]
	},
	{
		to: "/developer",
		label: "Developer",
		icon: CodeXml,
		roles: ["developer", "pm"]
	},
	{
		to: "/qa",
		label: "QA Review",
		icon: FlaskConical,
		roles: ["qa", "pm"]
	},
	{
		to: "/client",
		label: "Client Portal",
		icon: ExternalLink,
		roles: ["pm", "client"]
	}
];
var EXTRA_NAV = [
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn,
		roles: ["pm"]
	},
	{
		to: "/ai",
		label: "AI Tools",
		icon: Sparkles,
		roles: [
			"pm",
			"developer",
			"qa"
		]
	},
	{
		to: "/credentials",
		label: "Credentials",
		icon: Key,
		roles: ["pm"]
	}
];
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
			pathname: useRouterState({ select: (s) => s.location.pathname }),
			queryClient
		}) })
	});
}
function AppShell({ pathname, queryClient }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-full overflow-hidden bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "w-56 shrink-0 flex flex-col border-r border-border bg-sidebar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-14 flex items-center gap-3 px-5 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-7 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold italic text-sm",
						children: "TT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold tracking-tight",
							children: "Task Tracker"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-mono text-muted-foreground uppercase",
							children: "v0.2 · console"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 pt-3 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectSelector, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto py-4 px-2 space-y-1 no-scrollbar",
					children: [NAV_ITEMS.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: ["flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"].join(" "),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4 shrink-0",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}, item.to);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 mt-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 pb-2 text-[9px] font-mono uppercase text-muted-foreground tracking-wider",
							children: "Advanced"
						}), EXTRA_NAV.map((item) => {
							const active = pathname === item.to;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: ["flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"].join(" "),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4 shrink-0",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: item.label
								})]
							}, item.to);
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] font-mono text-muted-foreground text-center",
						children: "Task Tracker v0.2 · Data saved in browser"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex flex-col min-w-0 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
function ProjectSelector() {
	const { projects, currentProject, setCurrentProject, addProject, removeProject } = useProject();
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		clientName: "",
		endUsers: "",
		modules: ""
	});
	function handleCreate() {
		if (!form.name.trim()) return;
		addProject({
			name: form.name.trim(),
			clientName: form.clientName.trim(),
			endUsers: form.endUsers.split(",").map((s) => s.trim()).filter(Boolean),
			modules: form.modules.split(",").map((s) => s.trim()).filter(Boolean)
		});
		setForm({
			name: "",
			clientName: "",
			endUsers: "",
			modules: ""
		});
		setShowModal(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: currentProject?.id ?? "",
					onChange: (e) => setCurrentProject(e.target.value),
					className: "w-full appearance-none px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs font-medium focus:outline-none focus:border-primary cursor-pointer",
					children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.name
					}, p.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowModal(true),
					className: "flex-1 px-2 py-1 rounded text-[10px] font-mono uppercase text-primary border border-primary/30 hover:bg-primary/5 transition-colors",
					children: "+ New Project"
				}), projects.length > 1 && currentProject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => removeProject(currentProject.id),
					className: "px-2 py-1 rounded text-[10px] font-mono uppercase text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors",
					children: "Delete"
				})]
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/40",
				onClick: () => setShowModal(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm bg-card border border-border rounded-lg shadow-xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-3 border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: "New Project"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowModal(false),
								className: "p-1 rounded hover:bg-surface-2 text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] font-mono uppercase text-muted-foreground",
										children: "Project Name *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.name,
										onChange: (e) => setForm((p) => ({
											...p,
											name: e.target.value
										})),
										placeholder: "e.g. Tourism Website",
										className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
										autoFocus: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-1",
										children: "Task IDs will be auto-generated from the project name (e.g. TS-001)"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Client Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.clientName,
									onChange: (e) => setForm((p) => ({
										...p,
										clientName: e.target.value
									})),
									placeholder: "e.g. Acme Corp",
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "End Users"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.endUsers,
									onChange: (e) => setForm((p) => ({
										...p,
										endUsers: e.target.value
									})),
									placeholder: "Comma-separated (e.g. Admin, Manager, Staff)",
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Modules"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.modules,
									onChange: (e) => setForm((p) => ({
										...p,
										modules: e.target.value
									})),
									placeholder: "Comma-separated (e.g. Dashboard, Reports, Auth)",
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 px-4 py-3 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowModal(false),
								className: "px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleCreate,
								disabled: !form.name.trim(),
								className: "px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50",
								children: "Create"
							})]
						})
					]
				})
			})
		]
	});
}
var $$splitComponentImporter$7 = () => import("./tasks-Bi3It15d.mjs");
var Route$7 = createFileRoute("/tasks")({
	head: () => ({ meta: [{ title: "Tasks · Task Tracker" }, {
		name: "description",
		content: "Project task tracker table."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./reports-BPfy6-PR.mjs");
var Route$6 = createFileRoute("/reports")({
	head: () => ({ meta: [{ title: "Reports · Scrum AI" }, {
		name: "description",
		content: "AI-generated sprint reports and project insights."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./qa-C_wQMqrD.mjs");
var Route$5 = createFileRoute("/qa")({
	head: () => ({ meta: [{ title: "QA Review · Task Tracker" }, {
		name: "description",
		content: "QA review queue."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./developer-d86v-9N7.mjs");
var Route$4 = createFileRoute("/developer")({
	head: () => ({ meta: [{ title: "Developer · Task Tracker" }, {
		name: "description",
		content: "Developer workspace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./credentials-B7LwfIHG.mjs");
var Route$3 = createFileRoute("/credentials")({
	head: () => ({ meta: [{ title: "Credentials · Scrum AI" }, {
		name: "description",
		content: "Manage project credentials: API keys, logins, database URLs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./client-DJFDo5Ev.mjs");
var Route$2 = createFileRoute("/client")({
	head: () => ({ meta: [{ title: "Client Portal · Task Tracker" }, {
		name: "description",
		content: "Client project progress view."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./ai-CGqpoVR_.mjs");
var Route$1 = createFileRoute("/ai")({
	head: () => ({ meta: [{ title: "AI Assistant · Scrum AI" }, {
		name: "description",
		content: "AI-powered Scrum assistant hub with all tools."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-DWMSsqCp.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Dashboard · Task Tracker" }, {
		name: "description",
		content: "Project overview and task analytics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TasksRoute = Route$7.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => Route$8
});
var ReportsRoute = Route$6.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$8
});
var QaRoute = Route$5.update({
	id: "/qa",
	path: "/qa",
	getParentRoute: () => Route$8
});
var DeveloperRoute = Route$4.update({
	id: "/developer",
	path: "/developer",
	getParentRoute: () => Route$8
});
var CredentialsRoute = Route$3.update({
	id: "/credentials",
	path: "/credentials",
	getParentRoute: () => Route$8
});
var ClientRoute = Route$2.update({
	id: "/client",
	path: "/client",
	getParentRoute: () => Route$8
});
var AiRoute = Route$1.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => Route$8
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AiRoute,
	ClientRoute,
	CredentialsRoute,
	DeveloperRoute,
	QaRoute,
	ReportsRoute,
	TasksRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
