let reports = 0;
for (let branch of {{state.branches}}) {
  if (
    (branch.should_report_poundage == true && branch.tonnage_payment_made == false && branch.paid_by_headquarter_tonnage == true) ||
    (branch.headquarter_id == null && branch.should_report_poundage == true) ||
    (branch.headquarter_id == null && branch.paid_by_headquarter_tonnage == false)
  ) {
    reports++;
  }
}
if (reports > 0) {
  {{ui.home_goToPoundage.setDisabled(false)}};
}

{{ui.home_goToLicense.setDisabled(true)}};
for (let branch of {{state.branches}}) {
  if ((branch.paid_by_headquarter_license == true && branch.license_payment_made == false) || (branch.headquarter_id == null && branch.license_payment_made == false && branch.exempt_from_license == false)) {
    {{ui.home_goToLicense.setDisabled(false)}};
  }
}

return reports;