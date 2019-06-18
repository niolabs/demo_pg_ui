import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default class Page extends React.Component {
  state = { barcode: null, units: null, weight: null, state: null, log: [] };

  componentDidMount = () => {
    const { pkClient } = this.props;
    pkClient.addPatron('barcodes', patron => patron.on('message', (data) => this.writeDataToState(data, 'barcodes')));
    pkClient.addPatron('cycle', patron => patron.on('message', (data) => this.writeDataToState(data, 'cycle')));
    pkClient.addPatron('weights', patron => patron.on('message', (data) => this.writeDataToState(data, 'weights')));
    pkClient.addPatron('error', patron => patron.on('message', (data) => this.writeDataToState(data, 'error')));
    pkClient.addPatron('completed', patron => patron.on('message', (data) => this.writeDataToState(data, 'completed')));
  };

  componentWillUnmount = () => {
    if (this.pkClient) this.pkClient.disconnect();
  };

  writeDataToState = (data, topic) => {
    const { log } = this.state;
    const json = new TextDecoder().decode(data);
    const newData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);

    console.log(newData);
    if (topic !== 'weights') {
      log.unshift({
        time: new Date().toLocaleString(),
        topic,
        className: topic === 'error' ? 'text-danger' : topic === 'completed' ? 'text-success' : 'text-default',
        value: JSON.stringify(newData)
      });
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
            {log && log.map(l => (
              <Row key={`${l.time}${l.value}`}>
                <Col xs="3" className={l.className}>
                  {l.time}
                </Col>
                <Col xs="2" className={l.className}>
                  {l.topic}
                </Col>
                <Col xs="6" className={l.className}>
                  {l.value}
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
