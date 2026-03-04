(function () {
  "use strict";

  var roles = {
    admin:   { label: "Admin",            color: "#4f46e5" },
    tutor:   { label: "Tutor / Teacher",  color: "#0891b2" },
    student: { label: "Student / Trainee",color: "#059669" },
  };

  function setupDemoLogin() {
    var $btn = $("#demo-login-btn");
    var $picker = $("#demo-role-picker");
    if (!$btn.length) return;

    // Hover effects on role cards
    $picker.find(".demo-role-btn").each(function () {
      var role = $(this).data("role");
      var color = roles[role] ? roles[role].color : "#333";
      $(this).on("mouseenter", function () {
        $(this).css({ "border-color": color, "background": "#f7f7ff" });
      }).on("mouseleave", function () {
        $(this).css({ "border-color": "#e5e5e5", "background": "#fff" });
      });
    });

    // Toggle picker
    $btn.on("click", function () {
      if ($picker.is(":visible")) {
        $picker.css("display", "none");
        $btn.html("&#x1F3AD;&nbsp; Login with demo account");
      } else {
        $picker.css("display", "flex").show();
        $btn.html("&#x2715;&nbsp; Cancel");
      }
    });

    // Login on role click
    $picker.on("click", ".demo-role-btn", function () {
      var role = $(this).data("role");
      var $card = $(this);
      $card.prop("disabled", true);
      $card.find("strong").text("Logging in\u2026");

      frappe.call({
        method: "lms.demo_login.login_as",
        args: { role: role },
        callback: function (r) {
          window.location.href = (r.message && r.message.redirect) ? r.message.redirect : "/lms";
        },
        error: function () {
          $card.prop("disabled", false);
          $card.find("strong").text(roles[role] ? roles[role].label : role);
          frappe.msgprint("Demo login failed. Please try again.");
        },
      });
    });
  }

  $(document).ready(function () {
    setupDemoLogin();
  });
})();
