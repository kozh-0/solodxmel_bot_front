import { Button, Form, Input, message } from "antd";
import emailjs from "@emailjs/browser";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

type FieldType = {
  name: string;
  email: string;
  phone: string;
  location: string;
  comment: string;
};

export default function App() {
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
        setTimeout(() => {
          window.close();
        }, 4000);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      })
      .finally(() => setIsLoading(true));
  };

  return (
    <main>
      <Form
        disabled={isLoading}
        style={{ marginTop: "30px", maxWidth: 800, textAlign: "right" }}
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

        <Button type="primary" htmlType="submit" style={{}}>
          Отправить письмо
        </Button>
      </Form>
    </main>
  );
}
