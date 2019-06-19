import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default class Page extends React.Component {
  state = { barcode: null, units: null, weight: null, state: null, log: {} };

  componentDidMount = () => {
    const { pkClient } = this.props;
    ['barcodes', 'cycle', 'weights', 'error', 'completed'].map(topic => {
      pkClient.addPatron(topic, patron => patron.on('message', (data) => this.writeDataToState(data, topic)));
    });
  };

  componentWillUnmount = () => {
    if (this.pkClient) this.pkClient.disconnect();
  };

  writeDataToState = (data, topic) => {
    const { log } = this.state;
    const time = new Date().toLocaleString();
    const json = new TextDecoder().decode(data);
    const newData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);

    console.log(newData);
    if (topic !== 'weights') {
      const logKey = `${time} ${topic}`;
      log[logKey] = {
        className: topic === 'error' ? 'text-danger' : topic === 'completed' ? 'text-success' : 'text-default',
        value: JSON.stringify(newData),
      };
      this.setState({ log });
    }
    if (topic !== 'completed') {
      this.setState(newData);
    }
  };

  render = () => {
    const { barcode, units, weight, state, log } = this.state;
    return (
      <Row>
        <Col xs="4" className="text-center">
          <Card>
            <CardBody className="p-3 pg-card">
              <h5 className="m-0">Washing Machine</h5>
              <hr />
              <h1 className={state === true ? 'text-success' : state === false ? 'text-danger' : ''}>
                {state === true ? 'ON' : state === false ? 'OFF' : '-'}
              </h1>
            </CardBody>
          </Card>
        </Col>
        <Col xs="4" className="text-center">
          <Card>
            <CardBody className="p-3 pg-card">
              <h5 className="m-0">Scale</h5>
              <hr />
              <h1 className={weight === null ? 'text-danger' : 'mb-1'}>
                {weight === null ? 'OFF' : weight}
              </h1>
              <b>{weight !== null && units}</b>
            </CardBody>
          </Card>
        </Col>
        <Col xs="4" className="text-center">
          <Card>
            <CardBody className="p-3 pg-card">
              <h5 className="m-0">Barcode Scanner</h5>
              <hr />
              <h1>
                {barcode || '-'}
              </h1>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12">
          <div id="log">
            {Object.keys(log).reverse().map((k) => (
              <Row key={k}>
                <Col xs="4" className={log[k].className}>
                  {k}
                </Col>
                <Col xs="8" className={log[k].className}>
                  {log[k].value}
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>

    );
  };
}

Page.propTypes = {
  pkClient: PropTypes.object.isRequired,
};
