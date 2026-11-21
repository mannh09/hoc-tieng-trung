// bài | hán | pinyin | Hán Việt | nghĩa | loại từ | ví dụ | pinyin ví dụ | nghĩa ví dụ
const RAW = `N1|你|nǐ|nhĩ|bạn|pron.|你好！|Nǐ hǎo!|Xin chào!
N1|好|hǎo|hảo|tốt, khỏe|adj.|我很好。|Wǒ hěn hǎo.|Tôi rất khỏe.
N1|我|wǒ|ngã|tôi|pron.|我是学生。|Wǒ shì xuésheng.|Tôi là sinh viên.
N1|很|hěn|ngận|rất|adv.|今天很热。|Jīntiān hěn rè.|Hôm nay rất nóng.
N1|谢谢|xièxie|tạ tạ|cảm ơn|v.|谢谢你！|Xièxie nǐ!|Cảm ơn bạn!
N1|不客气|bú kèqi|bất khách khí|không có gì|phr.|A：谢谢！B：不客气。|A: Xièxie! B: Bú kèqi.|A: Cảm ơn! B: Không có gì.
N1|再见|zàijiàn|tái kiến|tạm biệt|v.|老师，再见！|Lǎoshī, zàijiàn!|Em chào thầy/cô ạ!
1|您|nín|nâm|ngài (lịch sự)|pron.|您好！|Nín hǎo!|Chào ngài!
1|他|tā|tha|anh ấy|pron.|他是老师。|Tā shì lǎoshī.|Anh ấy là giáo viên.
1|她|tā|tha|cô ấy|pron.|她是我妈妈。|Tā shì wǒ māma.|Bà ấy là mẹ tôi.
1|们|men|môn|(số nhiều)|suf.|我们是朋友。|Wǒmen shì péngyou.|Chúng tôi là bạn bè.
1|是|shì|thị|là|v.|我是越南人。|Wǒ shì Yuènán rén.|Tôi là người Việt Nam.
1|不|bù|bất|không|adv.|我不是老师。|Wǒ bú shì lǎoshī.|Tôi không phải giáo viên.
1|吗|ma|ma|(trợ từ hỏi)|part.|你好吗？|Nǐ hǎo ma?|Bạn khỏe không?
1|呢|ne|ni|còn … thì sao|part.|我很好，你呢？|Wǒ hěn hǎo, nǐ ne?|Tôi khỏe, còn bạn?
1|也|yě|dã|cũng|adv.|我也是学生。|Wǒ yě shì xuésheng.|Tôi cũng là sinh viên.
1|老师|lǎoshī|lão sư|giáo viên|n.|王老师很好。|Wáng lǎoshī hěn hǎo.|Thầy Vương rất tốt.
1|学生|xuésheng|học sinh|học sinh|n.|他是学生吗？|Tā shì xuésheng ma?|Anh ấy là học sinh à?
2|叫|jiào|khiếu|tên là, gọi|v.|我叫阮安。|Wǒ jiào Ruǎn Ān.|Tôi tên là Nguyễn An.
2|什么|shénme|thập ma|cái gì|pron.|你叫什么名字？|Nǐ jiào shénme míngzi?|Bạn tên là gì?
2|名字|míngzi|danh tự|tên|n.|我的名字是李明。|Wǒ de míngzi shì Lǐ Míng.|Tên tôi là Lý Minh.
2|姓|xìng|tính|họ|v.|我姓王。|Wǒ xìng Wáng.|Tôi họ Vương.
2|人|rén|nhân|người|n.|他是中国人。|Tā shì Zhōngguó rén.|Anh ấy là người Trung Quốc.
2|中国|Zhōngguó|Trung Quốc|Trung Quốc|n.|我想去中国。|Wǒ xiǎng qù Zhōngguó.|Tôi muốn đi Trung Quốc.
2|越南|Yuènán|Việt Nam|Việt Nam|n.|越南菜很好吃。|Yuènán cài hěn hǎochī.|Món Việt rất ngon.
2|哪|nǎ|na|nào|pron.|你是哪国人？|Nǐ shì nǎ guó rén?|Bạn là người nước nào?
2|国|guó|quốc|nước|n.|中国很大。|Zhōngguó hěn dà.|Trung Quốc rất rộng lớn.
2|认识|rènshi|nhận thức|quen biết|v.|认识你很高兴。|Rènshi nǐ hěn gāoxìng.|Rất vui được quen bạn.
2|高兴|gāoxìng|cao hứng|vui|adj.|我今天很高兴。|Wǒ jīntiān hěn gāoxìng.|Hôm nay tôi rất vui.
2|朋友|péngyou|bằng hữu|bạn bè|n.|他是我朋友。|Tā shì wǒ péngyou.|Anh ấy là bạn tôi.
2|谁|shéi|thùy|ai|pron.|她是谁？|Tā shì shéi?|Cô ấy là ai?
2|的|de|đích|của|part.|这是我的手机。|Zhè shì wǒ de shǒujī.|Đây là điện thoại của tôi.
3|零|líng|linh|số 0|num.|零九一二|líng jiǔ yāo èr|0912 (đọc số điện thoại)
3|一|yī|nhất|số 1|num.|我有一个哥哥。|Wǒ yǒu yí ge gēge.|Tôi có một anh trai.
3|二|èr|nhị|số 2|num.|今天十二号。|Jīntiān shí'èr hào.|Hôm nay ngày 12.
3|三|sān|tam|số 3|num.|我家有三口人。|Wǒ jiā yǒu sān kǒu rén.|Nhà tôi có ba người.
3|四|sì|tứ|số 4|num.|我四点去。|Wǒ sì diǎn qù.|Tôi đi lúc 4 giờ.
3|五|wǔ|ngũ|số 5|num.|这个五块钱。|Zhège wǔ kuài qián.|Cái này 5 tệ.
3|六|liù|lục|số 6|num.|今天星期六。|Jīntiān xīngqīliù.|Hôm nay thứ Bảy.
3|七|qī|thất|số 7|num.|我七点吃饭。|Wǒ qī diǎn chī fàn.|Tôi ăn cơm lúc 7 giờ.
3|八|bā|bát|số 8|num.|他八岁。|Tā bā suì.|Cậu bé 8 tuổi.
3|九|jiǔ|cửu|số 9|num.|现在九点。|Xiànzài jiǔ diǎn.|Bây giờ là 9 giờ.
3|十|shí|thập|số 10|num.|我有十块钱。|Wǒ yǒu shí kuài qián.|Tôi có 10 tệ.
3|几|jǐ|kỷ|mấy|pron.|你家有几口人？|Nǐ jiā yǒu jǐ kǒu rén?|Nhà bạn có mấy người?
3|多少|duōshao|đa thiểu|bao nhiêu|pron.|这个多少钱？|Zhège duōshao qián?|Cái này bao nhiêu tiền?
3|岁|suì|tuế|tuổi|m.|我二十八岁。|Wǒ èrshíbā suì.|Tôi 28 tuổi.
3|个|gè|cá|cái (lượng từ)|m.|我有两个朋友。|Wǒ yǒu liǎng ge péngyou.|Tôi có hai người bạn.
3|两|liǎng|lưỡng|hai (trước lượng từ)|num.|我要两杯茶。|Wǒ yào liǎng bēi chá.|Cho tôi hai cốc trà.
3|手机|shǒujī|thủ cơ|điện thoại di động|n.|你的手机号码是多少？|Nǐ de shǒujī hàomǎ shì duōshao?|Số điện thoại của bạn là bao nhiêu?
3|今年|jīnnián|kim niên|năm nay|n.|你今年多大了？|Nǐ jīnnián duō dà le?|Năm nay bạn bao nhiêu tuổi?
4|家|jiā|gia|nhà, gia đình|n.|我家很大。|Wǒ jiā hěn dà.|Nhà tôi rất rộng.
4|爸爸|bàba|ba ba|bố|n.|我爸爸是医生。|Wǒ bàba shì yīshēng.|Bố tôi là bác sĩ.
4|妈妈|māma|ma ma|mẹ|n.|妈妈，我回家了！|Māma, wǒ huí jiā le!|Mẹ ơi, con về rồi!
4|哥哥|gēge|ca ca|anh trai|n.|我哥哥在北京工作。|Wǒ gēge zài Běijīng gōngzuò.|Anh trai tôi làm việc ở Bắc Kinh.
4|姐姐|jiějie|tỷ tỷ|chị gái|n.|我姐姐是老师。|Wǒ jiějie shì lǎoshī.|Chị gái tôi là giáo viên.
4|弟弟|dìdi|đệ đệ|em trai|n.|我弟弟八岁。|Wǒ dìdi bā suì.|Em trai tôi 8 tuổi.
4|妹妹|mèimei|muội muội|em gái|n.|你有妹妹吗？|Nǐ yǒu mèimei ma?|Bạn có em gái không?
4|儿子|érzi|nhi tử|con trai|n.|他儿子三岁。|Tā érzi sān suì.|Con trai anh ấy 3 tuổi.
4|女儿|nǚ'ér|nữ nhi|con gái|n.|我有一个女儿。|Wǒ yǒu yí ge nǚ'ér.|Tôi có một con gái.
4|有|yǒu|hữu|có|v.|我今天有时间。|Wǒ jīntiān yǒu shíjiān.|Hôm nay tôi rảnh.
4|没有|méiyǒu|một hữu|không có|v.|我没有弟弟。|Wǒ méiyǒu dìdi.|Tôi không có em trai.
4|和|hé|hòa|và|conj.|爸爸和妈妈都很好。|Bàba hé māma dōu hěn hǎo.|Bố và mẹ đều khỏe.
4|都|dōu|đô|đều|adv.|我们都是越南人。|Wǒmen dōu shì Yuènán rén.|Chúng tôi đều là người Việt.
4|狗|gǒu|cẩu|con chó|n.|我家有两只狗。|Wǒ jiā yǒu liǎng zhī gǒu.|Nhà tôi có hai con chó.
5|今天|jīntiān|kim thiên|hôm nay|n.|今天星期五。|Jīntiān xīngqīwǔ.|Hôm nay thứ Sáu.
5|明天|míngtiān|minh thiên|ngày mai|n.|明天见！|Míngtiān jiàn!|Mai gặp nhé!
5|昨天|zuótiān|tạc thiên|hôm qua|n.|昨天下雨了。|Zuótiān xià yǔ le.|Hôm qua trời mưa.
5|年|nián|niên|năm|n.|2026年|èr líng èr liù nián|năm 2026
5|月|yuè|nguyệt|tháng|n.|今天十一月二十号。|Jīntiān shíyī yuè èrshí hào.|Hôm nay ngày 20 tháng 11.
5|号|hào|hiệu|ngày (khi nói)|n.|今天几号？|Jīntiān jǐ hào?|Hôm nay ngày mấy?
5|星期|xīngqī|tinh kỳ|tuần, thứ|n.|今天星期几？|Jīntiān xīngqī jǐ?|Hôm nay thứ mấy?
5|点|diǎn|điểm|giờ|m.|现在几点？|Xiànzài jǐ diǎn?|Bây giờ mấy giờ?
5|分|fēn|phân|phút|m.|八点十五分|bā diǎn shíwǔ fēn|8 giờ 15 phút
5|半|bàn|bán|rưỡi|num.|我七点半去。|Wǒ qī diǎn bàn qù.|Tôi đi lúc 7 rưỡi.
5|现在|xiànzài|hiện tại|bây giờ|n.|现在我很忙。|Xiànzài wǒ hěn máng.|Bây giờ tôi rất bận.
5|上午|shàngwǔ|thượng ngọ|buổi sáng|n.|上午十点见。|Shàngwǔ shí diǎn jiàn.|Gặp nhau lúc 10 giờ sáng.
5|下午|xiàwǔ|hạ ngọ|buổi chiều|n.|我下午去商店。|Wǒ xiàwǔ qù shāngdiàn.|Chiều tôi đi cửa hàng.
5|时候|shíhou|thời hậu|lúc, khi|n.|你什么时候去？|Nǐ shénme shíhou qù?|Khi nào bạn đi?
6|吃|chī|ngật|ăn|v.|你想吃什么？|Nǐ xiǎng chī shénme?|Bạn muốn ăn gì?
6|喝|hē|hát|uống|v.|我喝茶。|Wǒ hē chá.|Tôi uống trà.
6|想|xiǎng|tưởng|muốn, nhớ|aux.|我想喝咖啡。|Wǒ xiǎng hē kāfēi.|Tôi muốn uống cà phê.
6|要|yào|yếu|muốn, cần|v.|我要一碗米饭。|Wǒ yào yì wǎn mǐfàn.|Cho tôi một bát cơm.
6|米饭|mǐfàn|mễ phạn|cơm|n.|我吃米饭。|Wǒ chī mǐfàn.|Tôi ăn cơm.
6|菜|cài|thái|món ăn|n.|这个菜很好吃。|Zhège cài hěn hǎochī.|Món này rất ngon.
6|面条|miàntiáo|miến điều|mì sợi|n.|我要一碗面条。|Wǒ yào yì wǎn miàntiáo.|Cho tôi một bát mì.
6|水|shuǐ|thủy|nước|n.|我想喝水。|Wǒ xiǎng hē shuǐ.|Tôi muốn uống nước.
6|茶|chá|trà|trà|n.|中国茶很好喝。|Zhōngguó chá hěn hǎohē.|Trà Trung Quốc rất ngon.
6|咖啡|kāfēi|—|cà phê|n.|越南咖啡很好喝。|Yuènán kāfēi hěn hǎohē.|Cà phê Việt Nam rất ngon.
6|杯|bēi|bôi|cốc (lượng từ)|m.|一杯咖啡|yì bēi kāfēi|một cốc cà phê
6|碗|wǎn|oản|bát (lượng từ)|m.|两碗米饭|liǎng wǎn mǐfàn|hai bát cơm
6|好吃|hǎochī|hảo ngật|ngon|adj.|这个面条很好吃。|Zhège miàntiáo hěn hǎochī.|Món mì này rất ngon.
6|服务员|fúwùyuán|phục vụ viên|nhân viên phục vụ|n.|服务员，买单！|Fúwùyuán, mǎidān!|Phục vụ ơi, tính tiền!
7|买|mǎi|mãi|mua|v.|我想买衣服。|Wǒ xiǎng mǎi yīfu.|Tôi muốn mua quần áo.
7|卖|mài|mại|bán|v.|这儿卖苹果吗？|Zhèr mài píngguǒ ma?|Ở đây có bán táo không?
7|东西|dōngxi|đông tây|đồ vật|n.|我去商店买东西。|Wǒ qù shāngdiàn mǎi dōngxi.|Tôi đi cửa hàng mua đồ.
7|钱|qián|tiền|tiền|n.|我没有钱。|Wǒ méiyǒu qián.|Tôi không có tiền.
7|块|kuài|khối|đồng (tệ)|m.|十块钱|shí kuài qián|mười tệ
7|这|zhè|giá|này|pron.|这是我妈妈。|Zhè shì wǒ māma.|Đây là mẹ tôi.
7|那|nà|na|kia|pron.|那是什么？|Nà shì shénme?|Kia là cái gì?
7|贵|guì|quý|đắt|adj.|太贵了！|Tài guì le!|Đắt quá!
7|便宜|piányi|tiện nghi|rẻ|adj.|能便宜一点儿吗？|Néng piányi yìdiǎnr ma?|Rẻ hơn chút được không?
7|衣服|yīfu|y phục|quần áo|n.|那件衣服很便宜。|Nà jiàn yīfu hěn piányi.|Bộ quần áo kia rất rẻ.
7|苹果|píngguǒ|bình quả|quả táo|n.|我要两斤苹果。|Wǒ yào liǎng jīn píngguǒ.|Cho tôi 2 cân (1 kg) táo.
7|商店|shāngdiàn|thương điếm|cửa hàng|n.|商店在哪儿？|Shāngdiàn zài nǎr?|Cửa hàng ở đâu?
8|在|zài|tại|ở, tại|v.|我在家。|Wǒ zài jiā.|Tôi ở nhà.
8|哪儿|nǎr|na nhi|ở đâu|pron.|你去哪儿？|Nǐ qù nǎr?|Bạn đi đâu?
8|这儿|zhèr|giá nhi|ở đây|pron.|请到这儿。|Qǐng dào zhèr.|Làm ơn cho đến đây.
8|去|qù|khứ|đi (đến)|v.|我去学校。|Wǒ qù xuéxiào.|Tôi đến trường.
8|来|lái|lai|đến|v.|你来我家吗？|Nǐ lái wǒ jiā ma?|Bạn đến nhà tôi không?
8|回|huí|hồi|về|v.|我回家了。|Wǒ huí jiā le.|Tôi về nhà rồi.
8|学校|xuéxiào|học hiệu|trường học|n.|学校在医院后面。|Xuéxiào zài yīyuàn hòumiàn.|Trường học ở phía sau bệnh viện.
8|医院|yīyuàn|y viện|bệnh viện|n.|医院怎么走？|Yīyuàn zěnme zǒu?|Đi đến bệnh viện thế nào?
8|饭店|fàndiàn|phạn điếm|nhà hàng|n.|我在饭店吃饭。|Wǒ zài fàndiàn chī fàn.|Tôi ăn cơm ở nhà hàng.
8|前面|qiánmiàn|tiền diện|phía trước|n.|商店在前面。|Shāngdiàn zài qiánmiàn.|Cửa hàng ở phía trước.
8|后面|hòumiàn|hậu diện|phía sau|n.|他在我后面。|Tā zài wǒ hòumiàn.|Anh ấy ở phía sau tôi.
8|左边|zuǒbian|tả biên|bên trái|n.|医院在左边。|Yīyuàn zài zuǒbian.|Bệnh viện ở bên trái.
8|右边|yòubian|hữu biên|bên phải|n.|酒店在右边。|Jiǔdiàn zài yòubian.|Khách sạn ở bên phải.
8|怎么|zěnme|chẩm ma|thế nào, làm sao|pron.|去学校怎么走？|Qù xuéxiào zěnme zǒu?|Đến trường đi thế nào?
9|做|zuò|tố|làm|v.|你做什么工作？|Nǐ zuò shénme gōngzuò?|Bạn làm nghề gì?
9|工作|gōngzuò|công tác|công việc; làm việc|n.|我在公司工作。|Wǒ zài gōngsī gōngzuò.|Tôi làm việc ở công ty.
9|公司|gōngsī|công ti|công ty|n.|这是我们公司。|Zhè shì wǒmen gōngsī.|Đây là công ty chúng tôi.
9|医生|yīshēng|y sinh|bác sĩ|n.|她是医生。|Tā shì yīshēng.|Cô ấy là bác sĩ.
9|学习|xuéxí|học tập|học|v.|我在学习汉语。|Wǒ zài xuéxí Hànyǔ.|Tôi đang học tiếng Trung.
9|汉语|Hànyǔ|Hán ngữ|tiếng Trung|n.|你会说汉语吗？|Nǐ huì shuō Hànyǔ ma?|Bạn biết nói tiếng Trung không?
9|会|huì|hội|biết (nhờ học)|aux.|我会说一点儿汉语。|Wǒ huì shuō yìdiǎnr Hànyǔ.|Tôi biết nói một chút tiếng Trung.
9|能|néng|năng|có thể|aux.|明天我不能去。|Míngtiān wǒ bù néng qù.|Ngày mai tôi không đi được.
9|说|shuō|thuyết|nói|v.|请说慢一点儿。|Qǐng shuō màn yìdiǎnr.|Xin nói chậm một chút.
9|写|xiě|tả|viết|v.|我会写汉字。|Wǒ huì xiě Hànzì.|Tôi biết viết chữ Hán.
9|忙|máng|mang|bận|adj.|你忙吗？|Nǐ máng ma?|Bạn có bận không?
9|喜欢|xǐhuan|hỉ hoan|thích|v.|我喜欢我的工作。|Wǒ xǐhuan wǒ de gōngzuò.|Tôi thích công việc của tôi.
10|坐|zuò|tọa|ngồi; đi (xe)|v.|我坐飞机去北京。|Wǒ zuò fēijī qù Běijīng.|Tôi đi máy bay đến Bắc Kinh.
10|出租车|chūzūchē|xuất tô xa|taxi|n.|我坐出租车回家。|Wǒ zuò chūzūchē huí jiā.|Tôi đi taxi về nhà.
10|飞机|fēijī|phi cơ|máy bay|n.|飞机几点到？|Fēijī jǐ diǎn dào?|Máy bay mấy giờ đến?
10|火车|huǒchē|hỏa xa|tàu hỏa|n.|我坐火车去上海。|Wǒ zuò huǒchē qù Shànghǎi.|Tôi đi tàu hỏa đến Thượng Hải.
10|开车|kāichē|khai xa|lái xe|v.|你会开车吗？|Nǐ huì kāichē ma?|Bạn biết lái xe không?
10|天气|tiānqì|thiên khí|thời tiết|n.|今天天气怎么样？|Jīntiān tiānqì zěnmeyàng?|Hôm nay thời tiết thế nào?
10|冷|lěng|lãnh|lạnh|adj.|北京很冷。|Běijīng hěn lěng.|Bắc Kinh rất lạnh.
10|热|rè|nhiệt|nóng|adj.|今天太热了！|Jīntiān tài rè le!|Hôm nay nóng quá!
10|下雨|xià yǔ|hạ vũ|mưa|v.|下雨了！|Xià yǔ le!|Mưa rồi!
10|怎么样|zěnmeyàng|chẩm ma dạng|thế nào|pron.|这个菜怎么样？|Zhège cài zěnmeyàng?|Món này thế nào?
10|看|kàn|khán|xem, nhìn|v.|我看一下。|Wǒ kàn yíxià.|Để tôi xem một chút.`

export const VOCAB = RAW.split('\n').map((l) => {
  const [b, h, p, v, m, pos, ex, exp, exv] = l.split('|')
  return { b, h, p, v, m, pos, ex, exp, exv }
})

export const POS = {
  'n.': 'danh từ', 'v.': 'động từ', 'adj.': 'tính từ', 'adv.': 'phó từ', 'pron.': 'đại từ', 'num.': 'số từ',
  'm.': 'lượng từ', 'part.': 'trợ từ', 'conj.': 'liên từ', 'aux.': 'động từ năng nguyện', 'phr.': 'cụm từ', 'suf.': 'hậu tố',
}

// "Hình" minh hoạ (emoji)
export const EMOJI = {
  你: '🫵', 我: '🙋', 好: '👍', 谢谢: '🙏', 再见: '👋', 他: '👨', 她: '👩', 老师: '🧑‍🏫', 学生: '🧑‍🎓', 朋友: '🤝', 高兴: '😄', 名字: '🏷️',
  人: '🧍', 手机: '📱', 家: '🏠', 爸爸: '👨', 妈妈: '👩', 哥哥: '👦', 姐姐: '👧', 弟弟: '👦', 妹妹: '👧', 儿子: '👶', 女儿: '👶', 狗: '🐕',
  今天: '📅', 明天: '📅', 昨天: '📅', 星期: '🗓️', 点: '🕐', 分: '⏱️', 现在: '⏰', 上午: '🌅', 下午: '🌇',
  吃: '🍽️', 喝: '🥤', 米饭: '🍚', 菜: '🥘', 面条: '🍜', 水: '💧', 茶: '🍵', 咖啡: '☕', 杯: '🥛', 碗: '🥣', 好吃: '😋', 服务员: '🧑‍🍳',
  买: '🛒', 卖: '🏷️', 东西: '📦', 钱: '💰', 块: '💴', 贵: '💸', 便宜: '🤑', 衣服: '👕', 苹果: '🍎', 商店: '🏪',
  去: '🚶', 来: '🏃', 回: '↩️', 学校: '🏫', 医院: '🏥', 饭店: '🍽️', 前面: '⬆️', 后面: '⬇️', 左边: '⬅️', 右边: '➡️',
  工作: '💼', 公司: '🏢', 医生: '🧑‍⚕️', 学习: '📚', 汉语: '🀄', 说: '🗣️', 写: '✍️', 忙: '😵‍💫', 喜欢: '❤️',
  坐: '🪑', 出租车: '🚕', 飞机: '✈️', 火车: '🚆', 开车: '🚗', 天气: '⛅', 冷: '🥶', 热: '🥵', 下雨: '🌧️', 看: '👀',
  零: '0️⃣', 一: '1️⃣', 二: '2️⃣', 三: '3️⃣', 四: '4️⃣', 五: '5️⃣', 六: '6️⃣', 七: '7️⃣', 八: '8️⃣', 九: '9️⃣', 十: '🔟', 岁: '🎂',
}
