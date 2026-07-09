import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { O as Database, P as CircleCheck, T as EyeOff, _ as Globe, d as Plus, f as Lock, g as Key, k as Copy, t as X, w as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/credentials-B7LwfIHG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_META = {
	api: {
		label: "API Key",
		icon: Key
	},
	login: {
		label: "Login",
		icon: Lock
	},
	database: {
		label: "Database",
		icon: Database
	},
	other: {
		label: "Other",
		icon: Globe
	}
};
function generateId() {
	return Math.random().toString(36).slice(2, 8).toUpperCase();
}
var INITIAL_CREDS = [
	{
		id: generateId(),
		type: "api",
		service: "Groq",
		key: "GROQ_API_KEY",
		value: "gsk_••••••••••••••••",
		url: "https://console.groq.com",
		description: "Llama 3.3 70B for AI Scrum features",
		createdAt: "2026-06-20"
	},
	{
		id: generateId(),
		type: "database",
		service: "Supabase",
		key: "SUPABASE_URL",
		value: "https://jiiecdlxxzzskxcbfepi.supabase.co",
		description: "Project database and auth",
		createdAt: "2026-06-15"
	},
	{
		id: generateId(),
		type: "login",
		service: "SMTP Server",
		username: "noreply@sprint.app",
		key: "SMTP_PASSWORD",
		value: "••••••••••••",
		url: "https://mail.example.com",
		description: "Email sending for notifications",
		createdAt: "2026-06-18"
	},
	{
		id: generateId(),
		type: "api",
		service: "GitHub",
		key: "GITHUB_TOKEN",
		value: "ghp_••••••••••••••••",
		url: "https://github.com",
		description: "Repository access",
		createdAt: "2026-06-18"
	}
];
function Credentials() {
	const [creds, setCreds] = (0, import_react.useState)(INITIAL_CREDS);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [visible, setVisible] = (0, import_react.useState)({});
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		type: "api",
		service: "",
		username: "",
		key: "",
		value: "",
		url: "",
		description: ""
	});
	const Icon = TYPE_META[form.type].icon;
	function handleAdd() {
		if (!form.service.trim() || !form.key.trim() || !form.value.trim()) return;
		const entry = {
			id: generateId(),
			type: form.type,
			service: form.service.trim(),
			username: form.username.trim() || void 0,
			key: form.key.trim(),
			value: form.value.trim(),
			url: form.url.trim() || void 0,
			description: form.description.trim(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		};
		setCreds((prev) => [entry, ...prev]);
		setForm({
			type: "api",
			service: "",
			username: "",
			key: "",
			value: "",
			url: "",
			description: ""
		});
		setShowModal(false);
	}
	function handleRemove(id) {
		setCreds((prev) => prev.filter((c) => c.id !== id));
	}
	function handleCopy(val, id) {
		navigator.clipboard.writeText(val).then(() => {
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 1500);
		});
	}
	function maskValue(val) {
		if (val.length <= 8) return "•".repeat(val.length);
		return val.slice(0, 4) + "•".repeat(Math.min(val.length - 8, 24)) + val.slice(-4);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			crumbs: [{ label: "Scrum AI" }, { label: "Credentials" }],
			status: {
				label: `${creds.length} stored`,
				tone: "info"
			},
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowModal(true),
				className: "px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add Credential"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto p-6",
			children: creds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center h-full text-center py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "size-12 text-muted-foreground mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted-foreground",
						children: "No credentials stored"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: "Add API keys, logins, database URLs, and other secrets for your project."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 max-w-3xl",
				children: creds.map((c) => {
					const isVisible = visible[c.id];
					const TypeIcon = TYPE_META[c.type].icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 p-4 bg-card border border-border rounded-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-md bg-surface-2 border border-border grid place-items-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, { className: "size-4 text-primary" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold",
												children: c.service
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-mono uppercase text-muted-foreground bg-surface-2 px-1 rounded",
												children: TYPE_META[c.type].label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono text-muted-foreground bg-surface-2 px-1.5 rounded",
												children: c.key
											})
										]
									}),
									c.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono uppercase",
												children: "Username:"
											}),
											" ",
											c.username
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "text-xs font-mono text-muted-foreground break-all",
												children: isVisible ? c.value : maskValue(c.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setVisible((p) => ({
													...p,
													[c.id]: !isVisible
												})),
												className: "p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0",
												title: isVisible ? "Hide" : "Show",
												children: isVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleCopy(c.value, c.id),
												className: "p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0",
												title: "Copy",
												children: copiedId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
											})
										]
									}),
									c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-1",
										children: c.description
									}),
									c.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: c.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-[10px] text-primary hover:underline mt-0.5 inline-block",
										children: c.url
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-mono text-muted-foreground",
									children: c.createdAt
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleRemove(c.id),
									className: "p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive",
									title: "Remove",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
								})]
							})
						]
					}, c.id);
				})
			})
		}),
		showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/40",
			onClick: () => setShowModal(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg bg-card border border-border rounded-lg shadow-xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }), " Add Credential"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowModal(false),
							className: "p-1 rounded hover:bg-surface-2 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2 mt-1",
								children: [
									"api",
									"login",
									"database",
									"other"
								].map((t) => {
									const m = TYPE_META[t];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setForm((p) => ({
											...p,
											type: t
										})),
										className: `flex flex-col items-center gap-1 px-3 py-2 rounded-md border text-xs transition-colors ${form.type === t ? "bg-primary/10 border-primary text-primary" : "bg-surface-2 border-border text-muted-foreground hover:border-primary/40"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "size-4" }), m.label]
									}, t);
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Service *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.service,
									onChange: (e) => setForm((p) => ({
										...p,
										service: e.target.value
									})),
									placeholder: "e.g. OpenAI, AWS, Gmail",
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									autoFocus: true
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Key Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.key,
									onChange: (e) => setForm((p) => ({
										...p,
										key: e.target.value
									})),
									placeholder: form.type === "login" ? "SMTP_PASSWORD" : form.type === "database" ? "DB_URL" : "API_KEY",
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
								})] })]
							}),
							form.type === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Username / Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.username,
								onChange: (e) => setForm((p) => ({
									...p,
									username: e.target.value
								})),
								placeholder: "user@example.com",
								className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Secret Value *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.value,
								onChange: (e) => setForm((p) => ({
									...p,
									value: e.target.value
								})),
								placeholder: form.type === "login" ? "Enter password here" : form.type === "database" ? "postgresql://user:pass@host:5432/db" : "Paste the token or key here",
								className: "w-full mt-1 h-20 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none font-mono"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Service URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.url,
								onChange: (e) => setForm((p) => ({
									...p,
									url: e.target.value
								})),
								placeholder: "https://...",
								className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.description,
								onChange: (e) => setForm((p) => ({
									...p,
									description: e.target.value
								})),
								placeholder: "What is this credential used for?",
								className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 px-5 py-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowModal(false),
							className: "px-4 py-2 text-xs font-medium rounded border border-border hover:bg-surface-2",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleAdd,
							disabled: !form.service.trim() || !form.key.trim() || !form.value.trim(),
							className: "px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50",
							children: "Save Credential"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { Credentials as component };
