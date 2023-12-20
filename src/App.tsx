import { Button, Form, Input, Spin, message } from "antd";
import emailjs from "@emailjs/browser";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";

type FieldType = {
  name: string;
  email: string;
  phone: string;
  location: string;
  comment: string;
};

export default function App() {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (templateParams: FieldType) => {
    setIsLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      )
      .then((res) => {
        message.success({
          content: (
            <div>
              Спасибо, сообщение отправлено <br />
              Мы скоро с вами свяжемся!
            </div>
          ),
        });
        console.log("SUCCESS!", res.status, res.text);
        form.resetFields();
        // setTimeout(() => {
        //   window.close();
        // }, 4000);
      })
      .catch((err) => {
        message.error({ content: "Что-то пошло не так..." });
        console.log("FAILED...", err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <main>
      <Spin
        size="large"
        tip={<span style={{ color: "white" }}>Отправляем письмо...</span>}
        spinning={isLoading}
      >
        <Form
          form={form}
          disabled={isLoading}
          style={{ maxWidth: 800, textAlign: "right" }}
          // labelCol={{ span: 10 }}
          // wrapperCol={{ span: 16 }}
          onFinish={sendEmail}
        >
          <Form.Item<FieldType>
            label="Имя"
            name="name"
            rules={[{ required: true, message: "Введите имя!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "Введите E-mail!", type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Телефон"
            name="phone"
            rules={[
              // { required: true },
              {
                validator: (_, value) => {
                  return /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/gm.test(
                    value
                  )
                    ? Promise.resolve()
                    : Promise.reject("Некорректный номер!");
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Местопребывание"
            name="location"
            rules={[{ required: true, message: "Введите ваше местопребывание" }]}
          >
            <Input placeholder="(город, район)" />
          </Form.Item>

          <Form.Item<FieldType> name="comment">
            <TextArea placeholder="Комментарий" style={{ minHeight: "100px", resize: "none" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isLoading}>
            Отправить письмо
          </Button>
        </Form>
      </Spin>
    </main>
  );
}
