import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction'
import vtkLookupTable from 'vtk.js/Sources/Common/Core/LookupTable';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps.json'
import ColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps'
import ColorMapPresetNames from './ColorMapPresetNames.js'

import CategoricalColors from './CategoricalColors.js'
import CategoricalPresetNames from './CategoricalPresetNames.js'

const colorMaps = vtkColorMaps
  .filter((p) => p.RGBPoints)
  .filter((p) => p.ColorSpace !== 'CIELAB')

const body = document.getElementsByTagName('body')[0]

const canvas = document.createElement('canvas')
const width = 60
const height = 5
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);
body.appendChild(canvas)

const range = [0.0, 1.0]

const colorTransferFunction = vtkColorTransferFunction.newInstance()

const table = document.createElement('table')
const tableBody = document.createElement('tbody')

let moduleContent = `const ColorMapPresetIcons = new Map()

`

ColorMapPresetNames.forEach((presetName) => {
  const preset = ColorMaps.getPresetByName(presetName)

  colorTransferFunction.setMappingRange(range[0], range[1])
  colorTransferFunction.applyColorMap(preset)
  const rgba = colorTransferFunction.getUint8Table(
    range[0],
    range[1],
    width,
    4,
  );

  const ctx = canvas.getContext('2d');
  const pixelsArea = ctx.getImageData(0, 0, width, 256);
  for (let lineIdx = 0; lineIdx < 256; lineIdx++) {
    pixelsArea.data.set(rgba, lineIdx * 4 * width);
  }

  const nbValues = 256 * width * 4;
  const lineSize = width * 4;
  for (let i = 3; i < nbValues; i += 4) {
    pixelsArea.data[i] = 255 - Math.floor(i / lineSize);
  }

  ctx.putImageData(pixelsArea, 0, 0);

  const image = new Image()
  image.src = canvas.toDataURL("image/png")

  const row = document.createElement('tr')

  const colImage = document.createElement('td')
  colImage.appendChild(image)
  row.appendChild(colImage)

  const colText = document.createElement('td')
  const text = document.createTextNode(presetName)
  colText.appendChild(text)
  row.appendChild(colText)

  tableBody.appendChild(row)

  moduleContent += `
ColorMapPresetIcons.set('${presetName}', '${image.src}');
`

})

moduleContent += `
export default ColorMapPresetIcons;
`

table.appendChild(tableBody)
body.appendChild(table)
const label = document.createElement('label')
label.innerHTML = "ColorMapPresetIcons.js: <br>"
body.appendChild(label)
const colorPresetIconsModule = document.createElement('textarea')
colorPresetIconsModule.setAttribute('rows', '350')
colorPresetIconsModule.setAttribute('cols', '100')
colorPresetIconsModule.value = moduleContent
body.appendChild(colorPresetIconsModule)


const categoricalColors = 12
const lookupTable = vtkLookupTable.newInstance()

const lutTable = document.createElement('table')
const lutTableBody = document.createElement('tbody')

let lutModuleContent = `const CategoricalPresetIcons = new Map()

`

CategoricalPresetNames.forEach((presetName) => {
  const preset = CategoricalColors.get(presetName)
  const colors = CategoricalColors.get(presetName);

  //lookupTable.setIndexedLookup(true)
  //const annotations = new Uint8Array(categoricalColors);
  //for (let i = 0; i < categoricalColors; i++) {
    //annotations[i] = i;
  //}
  //lookupTable.setAnnotations(annotations, annotations);

  //const table = vtkDataArray.newInstance({
    //numberOfComponents: 4,
    //size: 4 * categoricalColors,
    //dataType: 'Uint8Array',
  //});
  //for (let i = 0; i < categoricalColors; i++) {
    //table.setTuple(i, colors[i].concat([255]));
  //}
  //lookupTable.setTable(table);

  if (width % categoricalColors !== 0) {
    console.error('width should be divisible by categoricalColors.')
  }
  const rgba = new Uint8Array(width * 4);

  const colorWidth = width / categoricalColors
  for (let i = 0; i < categoricalColors; i++) {
    const offset = i * colorWidth * 4
    const color = colors[i]
    for (let j = 0; j < colorWidth; j++) {
      rgba[offset + j*4] = color[0]
      rgba[offset + j*4 + 1] = color[1]
      rgba[offset + j*4 + 2] = color[2]
      rgba[offset + j*4 + 3] = 255
    }
  }

  const ctx = canvas.getContext('2d');
  const pixelsArea = ctx.getImageData(0, 0, width, 256);
  for (let lineIdx = 0; lineIdx < 256; lineIdx++) {
    pixelsArea.data.set(rgba, lineIdx * 4 * width);
  }

  const nbValues = 256 * width * 4;
  const lineSize = width * 4;
  for (let i = 3; i < nbValues; i += 4) {
    pixelsArea.data[i] = 255 - Math.floor(i / lineSize);
  }

  ctx.putImageData(pixelsArea, 0, 0);

  const image = new Image()
  image.src = canvas.toDataURL("image/png")

  const row = document.createElement('tr')

  const colImage = document.createElement('td')
  colImage.appendChild(image)
  row.appendChild(colImage)

  const colText = document.createElement('td')
  const text = document.createTextNode(presetName)
  colText.appendChild(text)
  row.appendChild(colText)

  lutTableBody.appendChild(row)

  lutModuleContent += `
CategoricalPresetIcons.set('${presetName}', '${image.src}');
`

})

lutModuleContent += `
export default CategoricalPresetIcons;
`

lutTable.appendChild(lutTableBody)
body.appendChild(lutTable)
const lutLabel = document.createElement('label')
lutLabel.innerHTML = "CategoricalPresetIcons.js: <br>"
body.appendChild(lutLabel)
const lutPresetIconsModule = document.createElement('textarea')
lutPresetIconsModule.setAttribute('rows', '150')
lutPresetIconsModule.setAttribute('cols', '100')
lutPresetIconsModule.value = lutModuleContent
body.appendChild(lutPresetIconsModule)
console.log(body)
