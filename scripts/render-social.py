"""Generate three social previews with the same series identity; CI-only."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import sys
out=Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)
font="/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
bold="/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
def f(n,heavy=False):
    return ImageFont.truetype(bold if heavy else font,n)
def preview(name, num, lines, sub, art):
    im=Image.new("RGB",(1200,630),"#f8f5ee")
    d=ImageDraw.Draw(im)
    d.rectangle((0,0,1200,14),fill="#18594b")
    d.rounded_rectangle((820,60,1150,570),radius=26,fill="#183e3a")
    d.text((62,52),"看見更多  /  THE NAKED DHAMMA",font=f(25,True),fill="#18594b")
    d.text((62,117),"第 "+num+" 篇  ·  互動探索",font=f(31,True),fill="#79521e")
    for i,line in enumerate(lines):
        d.text((62,180+i*88),line,font=f(64,True),fill="#243330")
    for i,line in enumerate(sub):
        d.text((65,390+i*48),line,font=f(28),fill="#475b55")
    d.rounded_rectangle((62,525,490,574),radius=16,fill="#18594b")
    d.text((84,531),"免費閱讀  ·  原典可查  ·  無追蹤",font=f(23,True),fill="#fffdf7")
    gold="#e8c58d"; mint="#b7e3ca"; brown="#a8794f"; dark="#183e3a"
    if art=="history":
        d.polygon([(858,180),(908,180),(921,471),(845,471)],fill="#c6a57f",outline=gold,width=4)
        for y in range(300,352,13): d.line((869,y,900,y),fill="#795f4b",width=3)
        d.rounded_rectangle((938,280,1056,461),radius=19,fill=brown,outline=gold,width=5)
        d.ellipse((938,252,1056,308),fill=gold,outline="#fff0ca",width=4)
        for x in (955,980,1005,1030): d.line((x,307,x+4,438),fill="#6c4a32",width=5)
        d.polygon([(974,121),(1123,108),(1110,230),(961,241)],fill="#d8b88c",outline=gold,width=5)
        for y in range(143,211,18): d.line((985,y,1096,y-8),fill="#826349",width=4)
        d.ellipse((1000,345,1110,455),outline=mint,width=9)
        d.line((1094,438,1130,495),fill=mint,width=13)
    elif art=="merit":
        d.ellipse((861,290,1110,398),fill=gold,outline="#fff0ca",width=5)
        d.pieslice((861,282,1110,510),0,180,fill=brown,outline=gold,width=5)
        d.ellipse((884,299,1088,375),fill="#294f41")
        for x,y in ((940,306),(1005,288),(1048,326)): d.ellipse((x-20,y-16,x+20,y+16),fill=mint)
        d.arc((930,123,1045,244),190,350,fill=mint,width=12)
        d.line((986,244,986,276),fill=mint,width=9)
    else:
        d.ellipse((850,135,1120,410),fill="#254d46",outline=gold,width=12)
        d.ellipse((888,177,1082,367),fill="#78a8a0",outline=mint,width=4)
        d.ellipse((933,218,1037,324),fill="#f3d59d",outline=dark,width=5)
        d.ellipse((967,252,1003,288),fill=dark)
        d.arc((885,335,1084,535),0,180,fill=gold,width=12)
    d.text((845,519),"故事 · 思辨 · 查證",font=f(25,True),fill=mint)
    im.save(out/name,format="PNG",optimize=True)
preview("social-index.png","一",["你看見的，","就是全部嗎？"],["從觀察開始","分辨所見、推論與未知"],"index")
preview("social-merit.png","二",["功德不是","價目表"],["不花錢能有功德嗎？","布施、慈心與智慧的原典故事"],"merit")
preview("social-history.png","三",["這真的是","佛陀說的嗎？"],["四位來客、一面古鼓、古代石刻","22 站佛法歷史偵探"],"history")
for name in ("social-index.png","social-merit.png","social-history.png"):
    with Image.open(out/name) as im:
        assert im.size==(1200,630) and im.format=="PNG"
        print(name,im.size,(out/name).stat().st_size)
