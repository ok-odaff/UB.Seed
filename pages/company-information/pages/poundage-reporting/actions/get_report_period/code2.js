	ui.reportPeriod.setValue({{state.report_periods.label}});
	ui.license_number_select.setValue(state.report_periods.detail_id);
 {{state.stop_sale_tonnage.shift()}}
	if ({{state.stop_sale_tonnage == 0}}) {
  {{ui.skipReportModal.open()}}
}
return {{data}};