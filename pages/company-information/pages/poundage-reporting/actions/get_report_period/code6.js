	let report = {{state.branch_reports}}.find(r => r.detail_id == {{state.report_periods.detail_id}})
{{state.branch_reports}}.shift(report)
ui.reportPeriod.setValue({{state.report_periods.report_period}});
return {{data}};