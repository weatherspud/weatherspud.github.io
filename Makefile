build: build.dice_notation build.hex_grid

build.dice_notation:
	cd ../web-dice-notation && make build && make eslint
	cp ../web-dice-notation/static/js/dice_notation.bundle.js .

build.hex_grid:
	cd ../web-grids && make build && make eslint
	cp ../web-grids/static/js/hex_grid.bundle.js .

clean: clean.dice_notation clean.hex_grid

clean.dice_notation:
	cd ../web-dice-notation && make clean

clean.hex_grid:
	cd ../web-grids && make clean
