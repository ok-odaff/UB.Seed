	ui.reportPeriod.setValue({{state.report_periods.label}});
	ui.license_number_select.setValue(state.report_periods.detail_id);
  {{ui.addAnotherReportButton.setDisabled(false)}};
 {{state.company_stop_sales.shift()}}
if ({{state.company_stop_sales == 0}}) {
  {{ui.skipReportModal.open()}}
}
return {{data}};