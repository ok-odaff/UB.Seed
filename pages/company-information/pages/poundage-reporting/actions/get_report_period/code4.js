	let report = {{state.branch_reports}}.find(r => r.detail_id == {{state.report_periods.detail_id}})
{{state.branch_reports}}.shift(report)
{{ui.license_number_select.setValue('')}}
return {{data}};