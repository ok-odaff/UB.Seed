let reports = 0;
for (let branch of {{state.branches}}) {
  if (branch.should_report_poundage == true && branch.tonnage_payment_made == false && branch.paid_by_headquarter_tonnage == true || branch.headquarter_id == null) {
    reports++
  }
}
if (reports > 0) {
  {{ui.home_goToPoundage.setDisabled(false)}}
}
     return reports