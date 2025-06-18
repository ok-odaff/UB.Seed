//for (let i =0; i < 1 ; i++) {
//  let label = {{data}}[i]
	ui.reportPeriod.setValue({{state.report_periods.label}});
  {{ui.poundageGoToPayment.setDisabled(true)}}
  {{ui.addAnotherReportButoon.setDisabled(false)}}
 {{state.stop_sales_list.shift()}}
//}
return {{data}};