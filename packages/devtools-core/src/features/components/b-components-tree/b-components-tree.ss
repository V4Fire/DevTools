- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< b-input.&__input &
			placeholder = Search (text or /regex/) |
			v-model = searchText |
			/// FIXME: use keydown
			@keyup.enter.exact = () => gotoNextItem(1) |
			@keyup.shift.enter = () => gotoNextItem(-1)
		.
			< template #icon
				< template v-if = searchText != ''
					{{ searchEntryIndex + 1 }}&nbsp;|&nbsp;{{ searchMatchCount }}

		< .&__wrapper ref = wrapper
			< b-tree &
				ref = tree |
				:items = items |
				:item = 'b-components-tree-item' |
				:itemProps = itemProps |
				:folded = false |
				:theme = 'pretty' |
				:cancelable = false
			.


