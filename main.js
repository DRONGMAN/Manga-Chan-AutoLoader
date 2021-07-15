;
//Сюда вписывать слово которое идет перед главой
const whatGlava = 'Глава'; 
//Сюда вписывать слово которое идет перед томом
const whatTom = 'Том';

const login = 'YourLogin'; //Логин
const password = 'YourPassword'; //Пароль
const MangaName = "Name of manga"; //Название манги (проверьте чтобы находилась через поиск)

//True - включает отображение браузера, False - выключает
VisibaleMode = false; 

var AdmZip = require('adm-zip');
var fs = require('fs');

const puppeteer = require('puppeteer');

try { (async () => {
  const browser = await puppeteer.launch({
    headless: !VisibaleMode
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 800,
    height: 800
  });

  await page.goto('https://manga-chan.me/');

  const inputLoginSelector = 'input[placeholder="Логин"]';
  const inputPasswordSelector = 'input[placeholder="Пароль"]';
  await page.type(inputLoginSelector, login);
  await page.type(inputPasswordSelector, password);

  const EnterBtnSelector = 'input[value="Вход"]';
  await page.click(EnterBtnSelector);

  const inputSearchSelector = 'input[placeholder="Ищем мангу, серию, автора..."]';

fs.readdir('./files', async function(err, items) {
  
  await page.waitForSelector(inputSearchSelector, {timeout: 60000});
  await page.type(inputSearchSelector, MangaName)

  const SearchSelector = 'img[id="search_button"]';
  await page.waitForSelector(SearchSelector, {timeout: 60000});
  await page.click(SearchSelector);

  const MangaPageSelector = '#dle-content > div.content_row > div.manga_row1 > div > h2 > a';
  await page.waitForSelector(MangaPageSelector, {timeout: 60000});
  await page.click(MangaPageSelector);

  const addchapterSelector = '#dle-content > div.ext > a:nth-child(1)';
  await page.waitForSelector(addchapterSelector, {timeout: 60000});
  await page.click(addchapterSelector);

  //обозначение имени, главы и тома
  for (var i=0;i<items.length;i++){
    var MangaTom = items[i].split(whatTom)[1].split(whatGlava)[0];
    var MangaGlava = items[i].split(whatGlava)[1].split(' [mangalib.me]')[0];

    console.log("Now: "+whatTom+' -' + MangaTom+ whatGlava+' -' + MangaGlava);

    //удаление последнего файла в архиве
    var zip = new AdmZip('./files/'+String(items[i]));
    var zipEntries = zip.getEntries();
    var CountOfFilesInZip = 0;
    zipEntries.forEach(function(zipEntry) {
      CountOfFilesInZip++;
    })
    CountOfFilesInZip --;
    zip.deleteFile((String(CountOfFilesInZip)+".png"))
    zip.writeZip('./files/'+String(items[i]))
    
    const inputTomSelector = 'input[name="xfield[vol]"]';
    await page.waitForSelector(inputTomSelector, {timeout: 60000});
    await page.type(inputTomSelector, MangaTom);
    const inputGlavaSelector = 'input[name="xfield[ch]"]';
    await page.type(inputGlavaSelector, MangaGlava);
    const inputFileSelector = 'input[name="xfield_manga"]';
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click(inputFileSelector),
    ]);
    await fileChooser.accept(['./files/'+String(items[i])]);
    
    const ButtonToModerSelector = 'button[name="add"]';
    await page.click(ButtonToModerSelector);
    
    const AddMoreSelector = '#wrap > div.main_fon > table > tbody > tr:nth-child(2) > td.news > a:nth-child(1)'
    await page.waitForSelector(AddMoreSelector, {timeout: 600000});
    console.log("Finish: "+whatTom+' -' + MangaTom+ whatGlava+' -' + MangaGlava);
    await page.click(AddMoreSelector);

  }
console.log("FINALE! if programm doesn't close, just close it");
});

await new Promise (r => {});

await browser.close();})();
}catch(err){};