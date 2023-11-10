- namespace [%fileName%]

- include 'components/super/i-dynamic-page'|b as placeholder

- template index() extends ['i-dynamic-page'].index
	- block body
		< .&__content
			< b-components-tree &
				ref = tree |
				:items = components |
				:folded = false |
				:theme = 'demo' |
				:cancelable = false
			.
			< template v-if = selectedComponentId
				< template v-if = selectedComponentData != null
					< b-components-panel &
						ref = panel |
						:componentData = selectedComponentData |
						:theme = 'demo' |
						:cancelable = true
					.
				< . v-else
					< p.&__placeholder
						< i
							Loading...

			< . v-else
				< p.&__placeholder
					< i
						Select a component


