;
const login = 'login'; //Логин
const password = 'password'; //Пароль
const SiteAdress = 'https://manga-chan.me/'; //ссылка на сайт

//путь к папке с архивами. обязательно замените \ на /
//если папка лежит там же где и main.js можно просто написать './Folder'
const Source = 'C:/Path/archives'; 

//true - включает отображение браузера, false - выключает
VisibaleMode = false; 

var AdmZip = require('adm-zip');
const fs = require('fs');
const { readdirSync, rename } = require('fs');

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

  await page.goto(SiteAdress);

  const inputLoginSelector = 'input[placeholder="Логин"]';
  const inputPasswordSelector = 'input[placeholder="Пароль"]';
  await page.type(inputLoginSelector, login);
  await page.type(inputPasswordSelector, password);

  const EnterBtnSelector = 'input[value="Вход"]';
  await page.click(EnterBtnSelector);

//удаление ' [mangalib.me]'
try{ 
  const files = readdirSync(Source);
  files.forEach(file => rename(
    Source + `/${file}`,
    Source + `/${file.split(' [mangalib.me]')[0]+'.zip'}`,
    err => 1
  ));
}catch(err){};

fs.readdir(Source, async function(err, items) {

  //обозначение имени, главы и тома
  for (var i=0;i<items.length;i++){
    try{
      var MangaTom = items[i].split('Том ')[1].split(' Глава')[0];
      var MangaName = items[i].split('Том')[0];
      var MangaGlava = items[i].split('Глава ')[1].split('.zip')[0];
    }
    catch(err){
      var MangaTom = items[i].split('Tom ')[1].split(' Glava')[0];
      var MangaName = items[i].split('Tom')[0];
      var MangaGlava = items[i].split('Glava ')[1].split('.zip')[0];
    }

    console.log("Now: " + MangaName +'Том - ' + MangaTom+ ' Глава - ' + MangaGlava);

    //поиск манги
    const inputSearchSelector = 'input[placeholder="Ищем мангу, серию, автора..."]';
    await page.waitForSelector(inputSearchSelector, {timeout: 60000});
    await page.type(inputSearchSelector, MangaName)

    // const SearchSelector = 'img[id="search_button"]';
    // await page.waitForSelector(SearchSelector, {timeout: 60000});
    // await page.click(SearchSelector);

    //const MangaPageSelector = '#dle-content > div.content_row > div.manga_row1 > div > h2 > a';
    const MangaPageSelector = '#searchsuggestions > a';
    await page.waitForSelector(MangaPageSelector, {timeout: 60000});
    await page.click(MangaPageSelector);

    const addchapterSelector = '#dle-content > div.ext > a:nth-child(1)';
    await page.waitForSelector(addchapterSelector, {timeout: 60000});
    await page.click(addchapterSelector);

    //удаление последнего файла в архиве
    var zip = new AdmZip(Source+String(items[i]));
    var zipEntries = zip.getEntries();
    var CountOfFilesInZip = 0;
    zipEntries.forEach(function(zipEntry) {
      CountOfFilesInZip++;
    })
    CountOfFilesInZip --;
    zip.deleteFile((String(CountOfFilesInZip)+".png"))
    zip.writeZip(Source+String(items[i]))
    
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
    await fileChooser.accept([Source+String(items[i])]);
    
    const ButtonToModerSelector = 'button[name="add"]';
    await page.click(ButtonToModerSelector);
    
    const AddMoreSelector = '#wrap > div.main_fon > table > tbody > tr:nth-child(2) > td.news > a:nth-child(1)'
    await page.waitForSelector(AddMoreSelector, {timeout: 600000});
    console.log("Finish: "+ MangaName +'Том - ' + MangaTom+ ' Глава - ' + MangaGlava);

  }
console.log("FINALE! if programm doesn't close, just close it");
});

await new Promise (r => {});

await browser.close();})();
}catch(err){};