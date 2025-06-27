let options = [];
for (let branch of {{state.branches}}) {
if (branch.paid_by_headquarter_tonnage == true && branch.should_report_poundage == true && branch.tonnage_payment_made == false) {
options.push({detail_id: branch.detail_id, license_number: branch.license_number})}
}
     return options