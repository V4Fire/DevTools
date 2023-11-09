- namespace [%fileName%]

- include 'components/base/b-tree'|b as placeholder

- template index() extends ['b-tree'].index
	- block body
		< b-input &
			v-if = level == 0 |
			placeholder = Search (text or /regex/) |
			:class = provide.elementClasses({ input: true }) |
			v-model = searchText |
			/// FIXME: use keydown
			@keyup.enter.exact = () => gotoNextItem(1) |
			@keyup.shift.enter = () => gotoNextItem(-1)
		.
			< template #icon
				< template v-if = searchText != ''
					{{ searchPosition }}&nbsp;|&nbsp;{{ searchMatches.length }}

		< div &
			ref = wrapper |
			:class = provide.elementClasses({ wrapper: { active: level == 0 } })
		.
			- super


