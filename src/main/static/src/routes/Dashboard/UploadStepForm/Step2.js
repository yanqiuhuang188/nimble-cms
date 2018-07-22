import React from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Alert, Divider} from 'antd';
import {routerRedux} from 'dva/router';
import {digitUppercase} from '../../../utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  render() {
    // console.log(JSON.stringify(this.props))
    const {form, data, dispatch, submitting, updating} = this.props;
    const {getFieldDecorator, validateFields} = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/dashboard/upload-step-form'));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'uploadForm/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };
    const onUpdateForm = e => {
      // console.log("1")
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'uploadForm/updateStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{marginBottom: 24}}
        />
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="付款账户">
          {data.payAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款账户">
          {data.receiverAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款人姓名">
          {data.receiverName}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="转账金额">
          <span className={styles.money}>{data.amount}</span>
          <span className={styles.uppercase}>
            （
            {digitUppercase(data.amount)}
            ）
          </span>
        </Form.Item>
        <Divider style={{margin: '24px 0'}}/>
        <Form.Item {...formItemLayout} label="支付密码" required={false}>
          {getFieldDecorator('password', {
            initialValue: '123456',
            rules: [
              {
                required: true,
                message: '需要支付密码才能进行支付',
              },
            ],
          })(<Input type="password" autoComplete="off" style={{width: '80%'}}/>)}
        </Form.Item>
        <Form.Item
          style={{marginBottom: 8}}
          wrapperCol={{
            xs: {span: 24, offset: 0},
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button type="primary" onClick={onUpdateForm} loading={updating} style={{marginLeft: 8}}>
            更新
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({uploadForm, loading}) => ({
    updating: loading.effects['uploadForm/updateStepForm'],
    submitting: loading.effects['uploadForm/submitStepForm'],
    data: uploadForm.step,
  }))(Step2);
