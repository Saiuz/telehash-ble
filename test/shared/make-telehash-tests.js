module.exports = function (Backend) {
  var telehash = require('telehash');
  var telehashBleCentral = require('../../telehash-ble-central');

  delete telehash.extensions.udp4;
  delete telehash.extensions.http;
  delete telehash.extensions.tcp4;
  delete telehash.extensions.webrtc;

  var backend = new Backend();
  telehash.add(telehashBleCentral(backend));

  describe('telehash', function () {
    this.timeout(30000);

    it('does telehash things', function (done) {
      console.log('tested');

      var endpoint = {
        hashname: "h744asytkx4py6qqmoduem7oobikyzo6agcitpihpoqfn4o7aqfa",
        keys: {
          '1a': "ajv7vse25varvz3ida6rnfmamdiwxjzeam",
          '2a': "gcbacirqbudaskugjcdpodibaeaqkaadqiaq6abqqiaquaucaeaqbd5ew7jzwxpab7zssbdl2fgbztrbvfvgsyiynahhljicea57fgxg5exdcjkvhtqaovniznvqfiru2ufb4pfjgp66vicn3ds3vwadzofbzxjznybkp2hrotymia3kvbialprbru7ivmezgrmyxyzvn36fenggovc5dapcwbslcoztv2bj2bh7xc5i4kbbg4l3baffted3yrj2uvykptbwh6vhrsmq2kgtez7oguc4ku324rmlpeop2lxdrr7zsn7rbrm4tpkeio7l23wznlrtw3nsymj2k6cycsoni2tmi5uuhbi3tmvyyhaflz4q5fqqba65j7yrv37lknb24bvl4elbep6h5rss5oyvxv2unooeynrjfbdob64walpwfrmubcueswxaeaubalpkdtcjqmmh5picamaqaai",
          '3a': "sfl23opsmff3gvmw3whxxugj6eydw35xw6rgtdlctriegheysatq",
        },
        secrets: {
          '1a': "niisq5hxnpfxvzr3fthdrml37cezc6pp",
          '2a': "gcbajjacaeaafaqbaeai7jfx2onv3yap6muqi26rjqom4injnjuwcgdibz22karahpzjvzxjfyyskvj44advlkglnmbkengvbipdzkjt7xvkatoy4w5nqa6lrion2oloakt6r4lu6dcag2vikac34imnh2flbgjulgf6gnlo7rjdjrtvixiydyvqmsytwm5oqkoqj75yxkhcqijxc6yibjmza66ekovfoct4ynr7vj4mtegsruzgp3rvaxcvg6xelc3zdt6s5y4mp6mtp4imlhe32rcdx26w5wlk4m5w3mwdcosxqwauttkgu3chnfbykg43fogbybk6pehjmeaihxkp6eno722tioxank7bcyjd7r7mmuxlwfn5ovdltrgdmkjii3qpxfqc35rmlfaivbevvybafaic32q4ysmddb7l2aqdaeaacaucaead6nzus5y6ntdw7cbhfkniqcqkjlxxzilpuxrnlu73kegmolkyactdkcvnytjy543qwinp6q3efaerzfkcssrf2f3xe6iqdv5c6gxmo2u6csrg7iid6wque3uxzp3rw5k67kianit4wnebn5xtvxihfuifrhmgplsywdpcu5g4asrmmdnq3grfbasqxubcldijvlkghw5uhfc5cvfre7yffjhzcvtqsvxhhka24ttssbm6s5ezhpk2mphzsvvgctbixvqxbpxnqajptdbnzsbqh4u32qg37hxg7upff42jcvdxpqitev4jzo24ntnr5vuw4r4ujygxat7ezhhc7fz5rmjhmavzbaudivz4qqkp7c5s5caguzmyhij4y2i2bv4ctxsmedyylj7vr7lxtwddsagycaubqeanehrr3d72sewg6l5rx2jm6rpdn4mzubnbvek7l2swss6w6o4h26dve7pzq6tmkwyoymy3atndyrnju7p4vfvjukb3x67cnc45xrlwc3c7rxhw447pbaa234mrc7nuguelwwiodabhfs7lovszhgrnau27pjfjofnbpfrpu6ms6gqhzspmv2hvx3lbqhzmnni3bdorzc4gahbnakaycafpakd53ma5kvolbchwnkawsfov76jomk6clck6ltt3vc7qzerd2uzk4mfyunvafc4hnfrei26uxfx2gjgagpyxgmvmliyvvdajivn742ux3eh6aem7cigkha6he6cgs6ancjucfnmfrjhtyhkpw3moaqixyjqcdu4excdvtlegznpwo55jwir3avxr4esp6gouimj3vt3qg3iqfambacadzsltqtsw27s2ygbrcvwmoxf5npckf5z5hel7gq4qk7svcupa5leb75treieykp4hiyddd7dhkromdu5ytjcspfh7xnh46gq7326krzoqvdxoe5w2jyobsogsosi2vuhzvfeno3arkt6jicfuwj325svq3jquozc3v5nowzaroa7xsbnivp5bb4gx3sjal2sqbcjosxekfkicqgaalpi2qfwxl6ghtjhfg3ryuipielxihu67agebrhijja33bbex47koguratw7j5t6xasshloqqdd5xczww2fag6xkrfc56sshij62oihyhfxb6iyc23zvetv2ahqwk667gkb2wptkob5jbcybiyc45332kg56phewlw3dftphcs6k7xz75ca5tmhr6p6epambhbudgiq4owiarakaycae5r5jxtyvzmfn5sxaikoe67smzx2mhti5lt3uvid45kx26fizwyzie5vn5bfhvqehoa7ukzm7topiebwkettjm6p5c7kayeayucahegxoimqjyfded6lw4at5rvu666b3wfro2i276egoudxrzjvdg74emxrmv6smciffouguyj7g3trefo4kq3iijncu5twzmvfl4e77dpo5a",
          '3a': "xwqgzdssvngmgyur2vazu67e25lross2octu5adpgzled7p2ka3a",
        }
      };

      telehash.mesh({ id: endpoint }, function (err, mesh) {
        if (err) {
          throw err;
        }

        mesh.accept = function (from) {
          console.log('Accepting telehash mesh');
          console.log(from);
          return mesh.link(from);
        };
        mesh.scan();
      });
    });
  });
};
