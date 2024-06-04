# identicon generator

version 0.2

## Main Demo

https://stepanoidteam.github.io/identicon-generator/

## editor demo

https://stepanoidteam.github.io/identicon-generator/editor

## todo

### editor

[ ] collapsibles for palette and cell matrix  
[ ] fix right panel height  
[ ] put each setting near panel where it used?  
[ ] simplify algo?
[ ] make area-based algo R Б split/rotate/mirror...

from this one:
https://hairic.itch.io/random-spr
make colors 1-n

-   use diff color schemes/palettes
-   maybe upload pic and auto gen color scheme from it?
-   get palettes by api from https://lospec.com/palette-list
    example:
    fetch('https://lospec.com/palette-list/oil-6.json').then(data=>data.json()).then(data=>console.log(data))
-   get palettes from images via https://coolors.co/image-picker

impl cellular automata (?)
as alternative impl: go from center, put blacks or whites, and repeat only on blacks

add shadows? darken light cell if black cell is below

impl solid/body/empty brushes to ensure some parts will be empty/solid/random
addone brush -- always solid but random color/shade

generate trees? full random bush, symmetric leg

## useful links

https://aikoncwd.itch.io/sprite-generator
