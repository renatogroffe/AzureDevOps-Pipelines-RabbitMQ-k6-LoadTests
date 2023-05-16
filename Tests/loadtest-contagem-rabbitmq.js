// Extensão do k6 para RabbitMQ:
// https://github.com/grafana/xk6-amqp
import Amqp from 'k6/x/amqp';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export default function () {

    Amqp.start({ connection_url: '#{RabbitMQConnection}#' });

    const dataAtual = new Date();
    var valorAtualSimulado = parseInt(dataAtual.getMinutes().toString().padStart(2, '0') +
        dataAtual.getSeconds().toString().padStart(2, '0') +
        dataAtual.getMilliseconds().toString().padStart(3, '0'));    
    //console.log(JSON.stringify(valorAtualSimulado));
    
    const resultadoContagem = {
        valorAtual: parseInt(valorAtualSimulado),
        producer: 'k6/amqp',
        kernel: 'ubuntu-latest',
        framework: 'k6',
        mensagem: 'Utilizando o k6 em teste de carga' };
    //console.log(JSON.stringify(resultadoContagem));

    Amqp.publish({
        queue_name: 'queue-contagem',
        body: JSON.stringify(resultadoContagem),
        content_type: "text/plain"
    });
    
    //console.log('Sucesso');
    sleep(1);
}

export function handleSummary(data) {
    return {
      "rabbitmq-loadtests.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true })
    };
}