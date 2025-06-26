let hq_pays_license = [];
let hq_does_not_pay_license = [];
let hq_pays_tonnage = [];
let hq_does_not_pay_tonnage = [];
for (let branch in {{state.branches}}) {
  if ({{state.branches}}[branch].paid_by_headquarter_license == true) {
    hq_pays_license.push({{state.branches}}[branch].detail_id)
 } else {
 		hq_does_not_pay_license.push({{state.branches}}[branch].detail_id)
}

  if ({{state.branches}}[branch].paid_by_headquarter_tonnage == true) {
    hq_pays_tonnage.push({{state.branches}}[branch].detail_id)
 } else {
 		hq_does_not_pay_tonnage.push({{state.branches}}[branch].detail_id)
}
}

let query = [];
if (hq_pays_license.length > 0) {
  query.push(
    `update company_detail
    set paid_by_headquarter_license = 1
    where detail_id in (${hq_pays_license.join(', ')})`)
};
if (hq_does_not_pay_license.length > 0 ) {
  query.push(
    `update company_detail
    set paid_by_headquarter_license = 0
    where detail_id in (${hq_does_not_pay_license.join(', ')})`)
};
if (hq_pays_tonnage.length > 0) {
   query.push(
    `update company_detail
    set paid_by_headquarter_tonnage = 1
    where detail_id in (${hq_pays_tonnage.join(', ')})`)
};
if (hq_does_not_pay_tonnage.length > 0) {
   query.push( 
    `update company_detail
    set paid_by_headquarter_tonnage = 0
    where detail_id in (${hq_does_not_pay_tonnage.join(', ')})`)
}

return query.join(' ')