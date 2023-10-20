- namespace [%fileName%]

- include 'components/super/i-dynamic-page'|b as placeholder

- template index() extends ['i-dynamic-page'].index
	- block body
		< ul
			< li
				Component 1
			< li
				Component 2
			< li
				Component 3
