- namespace [%fileName%]

- include 'components/super/i-dynamic-page'|b as placeholder

- template index() extends ['i-dynamic-page'].index
	- block body
		< .&__content
			< b-tree &
				ref = tree |
				:items = components |
				:folded = false |
				:theme = 'demo' |
				:cancelable = true
			.
				< template #default = {item}
					{{ item.label }} value={{ item.value }}

			< template v-if = selectedComponentId
				< template v-if = selectedComponentMeta.length > 0
					< div
						< bold
							{{ selectedComponentName }}
						< b-tree &
							ref = panel |
							:items = selectedComponentMeta |
							:theme = 'demo' |
							:cancelable = true
						.
							< template #default = {item}
								{{ item.label }}
								< template v-if = item.data !== undefined
									= {{ item.data }}
				< p v-else
					< i
						Loading...

			< p v-else
				< i
					Select a component


