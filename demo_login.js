(function () {
  "use strict";

  if (window.location.pathname !== "/login") return;

  function injectDemoLogin() {
    var $loginSection = $(".for-login");
    if (!$loginSection.length) return;
    if ($("#demo-login-wrapper").length) return;

    var wrapper = $(
      '<div id="demo-login-wrapper" style="margin-top:12px;">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">' +
          '<div style="flex:1;height:1px;background:#e0e0e0;"></div>' +
          '<span style="font-size:11px;color:#aaa;white-space:nowrap;letter-spacing:.3px;">or try a demo account</span>' +
          '<div style="flex:1;height:1px;background:#e0e0e0;"></div>' +
        '</div>' +
        '<div id="demo-role-picker" style="display:none;flex-direction:column;gap:6px;margin-bottom:6px;"></div>' +
        '<button id="demo-login-btn" type="button" class="btn btn-sm btn-default btn-block" ' +
          'style="border:1.5px dashed #c2c2c2;color:#555;background:#fafafa;border-radius:8px;' +
          'padding:9px 0;font-size:13px;">' +
          '\uD83C\uDFAD\u00A0 Login with demo account' +
        '</button>' +
      '</div>'
    );

    $loginSection.find(".page-card-actions").first().after(wrapper);

    var roles = [
      { key: "admin",   label: "Admin",            desc: "Full system access",         icon: "\uD83D\uDEE1\uFE0F", color: "#4f46e5" },
      { key: "tutor",   label: "Tutor / Teacher",   desc: "Create & manage courses",    icon: "\uD83C\uDF93", color: "#0891b2" },
      { key: "student", label: "Student / Trainee", desc: "Browse & enrol in courses",  icon: "\uD83D\uDCDA", color: "#059669" },
    ];

    var $picker = $("#demo-role-picker");
    roles.forEach(function (role) {
      var $btn = $(
        '<button type="button" class="demo-role-btn" data-role="' + role.key + '" ' +
          'style="display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid #e5e5e5;' +
          'border-radius:8px;background:#fff;cursor:pointer;text-align:left;width:100%;' +
          'font-family:inherit;">' +
          '<span style="font-size:22px;line-height:1;">' + role.icon + '</span>' +
          '<span>' +
            '<strong style="display:block;font-size:13px;color:' + role.color + ';">' + role.label + '</strong>' +
            '<small style="color:#888;font-size:11px;">' + role.desc + '</small>' +
          '</span>' +
        '</button>'
      );
      $btn.on("mouseenter", function () {
        $(this).css({ "border-color": role.color, "background": "#f7f7ff" });
      });
      $btn.on("mouseleave", function () {
        $(this).css({ "border-color": "#e5e5e5", "background": "#fff" });
      });
      $picker.append($btn);
    });

    $("#demo-login-btn").on("click", function () {
      var $p = $("#demo-role-picker");
      if ($p.is(":visible")) {
        $p.css("display", "none");
        $(this).html('\uD83C\uDFAD\u00A0 Login with demo account');
      } else {
        $p.css("display", "flex").show();
        $(this).html('\u2715\u00A0 Cancel');
      }
    });

    $picker.on("click", ".demo-role-btn", function () {
      var role = $(this).data("role");
      var roleInfo = roles.find(function (r) { return r.key === role; });
      var $btn = $(this);
      $btn.prop("disabled", true);
      $btn.find("strong").text("Logging in\u2026");

      frappe.call({
        method: "lms.demo_login.login_as",
        args: { role: role },
        callback: function (r) {
          window.location.href = (r.message && r.message.redirect) ? r.message.redirect : "/lms";
        },
        error: function () {
          $btn.prop("disabled", false);
          $btn.find("strong").text(roleInfo.label);
          frappe.msgprint("Demo login failed. Please try again.");
        },
      });
    });
  }

  $(document).ready(function () {
    injectDemoLogin();
  });
})();
