let report = {{state.seed_poundage}}.find(r => r.detail_id == {{data.detail_id}})
{{state.seed_poundage}}.shift(report)