	ui.reportPeriod.setValue({{state.report_periods.report_period}});
	ui.license_number_select.setValue(state.report_periods.detail_id);
 {{state.branch_reports.shift()}}
  {{ui.addAnotherReportButton.setDisabled(false)}};
return {{data}};