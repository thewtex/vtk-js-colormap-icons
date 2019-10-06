import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction'
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps.json'
import ColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps'
import ColorPresetNames from './ColorPresetNames.js'

const colorMaps = vtkColorMaps
  .filter((p) => p.RGBPoints)
  .filter((p) => p.ColorSpace !== 'CIELAB')

const body = document.getElementsByTagName('body')[0]

const canvas = document.createElement('canvas')
const width = 240
const height = 20
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);
body.appendChild(canvas)

const range = [0.0, 1.0]

const colorTransferFunction = vtkColorTransferFunction.newInstance()

const table = document.createElement('table')
const tableBody = document.createElement('tbody')

let moduleContent = `const ColorPresetIcons = new Map()

let image = null;

`

ColorPresetNames.forEach((presetName) => {
  const preset = ColorMaps.getPresetByName(presetName)
//colorMaps.forEach((preset) => {
  //const presetName = preset.Name
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
ColorPresetIcons['${presetName}'] = '${image.src}';
`

})

moduleContent += `export default ColorPresetIcons;
`

table.appendChild(tableBody)
body.appendChild(table)
const label = document.createElement('label')
label.innerHTML = "ColorPresetIcons.js: <br>"
body.appendChild(label)
const colorPresetIconsModule = document.createElement('textarea')
colorPresetIconsModule.setAttribute('rows', '800')
colorPresetIconsModule.setAttribute('cols', '100')
colorPresetIconsModule.value = moduleContent
body.appendChild(colorPresetIconsModule)

console.log(body)
