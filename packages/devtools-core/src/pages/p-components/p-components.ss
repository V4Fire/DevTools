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
				< template v-if = selectedComponentData != null
					< b-components-panel &
						ref = panel |
						:componentData = selectedComponentData |
						:theme = 'demo' |
						:cancelable = true
					.
				< p v-else
					< i
						Loading...

			< p v-else
				< i
					Select a component


