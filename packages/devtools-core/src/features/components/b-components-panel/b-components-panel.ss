- namespace [%fileName%]

- include 'components/super/i-block'|b as placeholder

- template index() extends ['i-block'].index
	- block body
		< .&__header
			< b
				{{ componentData.componentName.camelize(false) }}

			< .&__header-actions
				< b-icon-button &
					:hint = "Inspect&nbsp;DOM" |
					:hintPos = 'bottom-left' |
					:icon = 'inspect' |
					@click = onInspect
				.

				< b-icon-button &
					:hint = (showEmpty ? "Hide" : "Show") + "&nbsp;empty" |
					:hintPos = 'bottom-left' |
					:icon = (showEmpty ? 'circle' : 'circle-dashed') |
					@click = onShowEmptyChange
				.

		< .&__body
			< b-tree &
				ref = tree |
				:items = items |
				:item = 'b-components-panel-item' |
				:theme = 'pretty' |
				:cancelable = true |
				:itemProps = getPanelItemProps
			.
