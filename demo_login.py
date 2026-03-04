import frappe
from frappe import _

DEMO_USERS = {
    "admin": "demo.admin@lms.localhost",
    "tutor": "demo.tutor@lms.localhost",
    "student": "demo.student@lms.localhost",
}


@frappe.whitelist(allow_guest=True)
def login_as(role):
    if role not in DEMO_USERS:
        frappe.throw(_("Invalid demo role: {0}").format(role))

    user = DEMO_USERS[role]
    if not frappe.db.exists("User", user):
        frappe.throw(_("Demo user not found. Please contact administrator."))

    frappe.local.login_manager.login_as(user)
    frappe.db.commit()
    return {"redirect": "/lms"}
