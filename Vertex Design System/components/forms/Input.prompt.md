Text field for commission enquiries and showroom bookings.

```jsx
<Input label="Full name" required value={name} onChange={e => setName(e.target.value)} />
<Input label="Email" type="email" help="Used only for your build-slot correspondence." />
```

Labels are uppercase mono in Aged Brass, never sentence-case sans. Error text is the only Corsa Red permitted in a form.
