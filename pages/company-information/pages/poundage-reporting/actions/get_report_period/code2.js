	ui.reportPeriod.setValue({{state.report_periods.label}});
  {{ui.poundageGoToPayment.setDisabled(true)}}
  {{ui.addAnotherReportButoon.setDisabled(false)}}
 {{state.company_stop_sales.shift()}}
if ({{state.company_stop_sales == 0}}) {
  {{ui.skipReportModal.open()}}
}
return {{data}};