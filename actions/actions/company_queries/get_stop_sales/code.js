let branches = [{{state.login_information.detail_id}}];
for (let branch in {{state.branches}}) {
branches.push({{state.branches[branch].detail_id}})
}
return branches