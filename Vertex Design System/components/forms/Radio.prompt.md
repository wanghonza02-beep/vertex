Mutually exclusive choice — build tier, appointment slot, contact preference.

```jsx
<RadioGroup label="Enquiry type" name="kind" value={v} onChange={setV}
  options={['Available build','Commission','Private viewing']} />
```

Use `RadioGroup` rather than loose `Radio`s so the mono group label stays consistent.
