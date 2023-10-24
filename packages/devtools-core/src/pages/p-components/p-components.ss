- namespace [%fileName%]

- include 'components/super/i-dynamic-page'|b as placeholder

- template index() extends ['i-dynamic-page'].index
	- block body
		< b-tree &
			:items = tree |
			:folded = false |
			:theme = 'demo'
		.
			< template #default = {item}
       {{ item.label }} value={{ item.value }}
