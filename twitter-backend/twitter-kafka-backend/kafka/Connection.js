var kafka = require('kafka-node');
var client = new kafka.KafkaClient();

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        
            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ {topic: topic_name, partition:0 },{topic: topic_name, partition:1 },{topic: topic_name, partition:2 }]);
            this.client.on('ready', function () { console.log('client ready!') })
        
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;